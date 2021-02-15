import {
	Arg,
	Ctx,
	Field,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from 'type-graphql';
import argon2 from 'argon2';
import { v4 } from 'uuid';

import {
	__COOKIE_NAME__,
	__PROD__,
	__FORGET_PASSWORD_PREFIX__,
} from '../constants';
import { Context } from '../types/Context';
import { User } from '../models/user.model';
import { FieldError } from '../models/error.model';
import {
	validateCorrectPassword,
	validatePasswordStrength,
	validateNewUsername,
	validateNewEmail,
	validateEmailExists,
	validateNewPasswordsMatch,
} from '../validators/user.validators';
import { sendResetPasswordEmail } from '../util/sendEmail';

/**
 * Response structure for user queries and mutations
 */
@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	/**
	 * Attempts to get the requesters information if they are logged in
	 * @param context The context
	 */
	@Query(() => User, { nullable: true })
	async me(@Ctx() { prisma, req }: Context): Promise<User | null> {
		// Checks if the user is logged in
		if (!req.session.userId) {
			return null;
		}

		// Gets the users information
		const user = await prisma.user.findUnique({
			where: { id: req.session.userId },
		});

		return user;
	}

	/**
	 * Attempts to find a user in the db with a given id
	 * @param id The id being queried
	 * @param prisma The prisma client
	 */
	@Query(() => User)
	async user(@Arg('id') id: number, @Ctx() { prisma }: Context) {
		return await prisma.user.findUnique({ where: { id } });
	}

	/**
	 * Attempts to log a user in with given credentials
	 * @param options The username and password credentials
	 * @param prisma The context
	 */
	@Mutation(() => UserResponse)
	async login(
		@Arg('credential') credential: string,
		@Arg('password') password: string,
		@Ctx() { prisma, req }: Context,
	): Promise<UserResponse> {
		// Attempts to find a user with the passed in username
		const user = await prisma.user.findFirst({
			where: { OR: [{ username: credential }, { email: credential }] },
		});

		// Sends an error if the username wasn't found
		if (!user) {
			return {
				errors: [
					{
						field: 'credential',
						message:
							'Could not find a user with the provided credential',
					},
				],
			};
		}

		// Checks that the password matches
		const errors = await validateCorrectPassword(user.password, password);

		if (errors.length > 0) {
			return { errors };
		}

		// Puts the user id on a session cookie
		req.session.userId = user.id;

		// If the code reaches here, the user exists and the password matches
		// Sends the user their information
		return { user };
	}

	/**
	 * Attempts to logout the user by clearing their session
	 * @param context The context
	 *
	 * @returns True if the session was successfully deleted, false otherwise
	 */
	@Mutation(() => Boolean)
	async logout(@Ctx() { req, res }: Context): Promise<Boolean> {
		return new Promise((resolve) =>
			// Attempts to destroy the session on the redis server
			req.session.destroy((err) => {
				if (err) {
					resolve(false);
					return;
				}

				// Clears the session cookie on the client
				res.clearCookie(__COOKIE_NAME__);
				resolve(true);
			}),
		);
	}

	/**
	 * Attempts to register a user account given a username and password
	 * @param options The username and password
	 * @param context The context
	 */
	@Mutation(() => UserResponse)
	async register(
		@Arg('email') email: string,
		@Arg('username') username: string,
		@Arg('password') password: string,
		@Ctx() { prisma, req }: Context,
	): Promise<UserResponse> {
		// Trim the credentials
		email = email.trim();
		username = username.trim();
		password = password.trim();

		// Used to keep track of any errors that occur
		const errors = [
			...(await validateNewEmail(email, prisma)),
			...(await validateNewUsername(username, prisma)),
			...validatePasswordStrength(password),
		];

		// Checks if there were any errors
		if (errors.length > 0) {
			return { errors };
		}

		// Generates a hash of the users password
		const hashedPassword = await argon2.hash(password);

		// Attempts to write the user to the db
		const user = await prisma.user.create({
			data: { email, username, password: hashedPassword },
		});

		// Puts the user id on a session cookie
		req.session.userId = user.id;

		return { user };
	}

	/**
	 * Attempts to send a forgot password email to the sent email address
	 * @param email The email to send the link to
	 * @param context The prisma client and redis client
	 */
	@Mutation(() => UserResponse)
	async forgotPassword(
		@Arg('email') email: string,
		@Ctx() { prisma, redis }: Context,
	) {
		// Checks to see that the email exists
		const errors = await validateEmailExists(email, prisma);

		if (errors.length > 0) {
			return { errors };
		}

		const token = v4();

		// Creates a token in the redis store that expires in 15 minutes
		await redis.set(
			`${__FORGET_PASSWORD_PREFIX__}${token}`,
			email,
			'ex',
			1000 * 60 * 15, // 15 Minutes
		);

		const resetPasswordHTML = `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`;
		await sendResetPasswordEmail(email, resetPasswordHTML);

		return [];
	}

	/**
	 * Attempts to change the password to the account associated with the
	 * forgot password token. This could fail for several reasons.
	 * 1. The passwords don't match
	 * 2. The password is not strong enough
	 * 3. The token is expired
	 * 4. The token is invalid
	 * 5. The account linked with the token no longer exists
	 * @param newPassword The users new password
	 * @param newPasswordConfirm A copy of the users new password for validation
	 * @param token The token accompanying the reset request
	 * @param context The prisma and redis clients
	 */
	@Mutation(() => UserResponse)
	async resetPassword(
		@Arg('newPassword') newPassword: string,
		@Arg('newPasswordConfirm') newPasswordConfirm: string,
		@Arg('token') token: string,
		@Ctx() { prisma, redis }: Context,
	): Promise<UserResponse> {
		newPassword = newPassword.trim();
		newPasswordConfirm = newPasswordConfirm.trim();

		const errors = [
			...validateNewPasswordsMatch(newPassword, newPasswordConfirm),
			...validatePasswordStrength(newPassword),
		];

		if (errors.length > 0) {
			return { errors };
		}

		// Gets the redis entry for the given token, which should be a user id
		// We send back a pretty generic error message if they gave us an invalid token
		// This is by design as we don't want to give too much information
		const key = `${__FORGET_PASSWORD_PREFIX__}${token}`;
		const userEmail = await redis.get(key);
		if (!userEmail) {
			return {
				errors: [
					{
						field: 'token',
						message: 'Token expired',
					},
				],
			};
		}

		// Hashes the new password
		const hashedPassword = await argon2.hash(newPassword);

		// Finds the user with the user id and updates their password
		try {
			const user = await prisma.user.update({
				where: { email: userEmail },
				data: { password: hashedPassword },
			});

			// The update was successful, delete the token from redis
			await redis.del(key);

			return { user };
		} catch (err) {
			// The error condition should only happen in exceptional circumstances
			// In order to error, the user would have to
			// 1. Send a forget password request, creating a token in the redis store
			// 2. Delete their account
			// 3. Go to the link in the email and attempt to reset their password before
			//    the token expires
			return {
				errors: [
					{
						field: 'token',
						message: 'This account does not exist anymore',
					},
				],
			};
		}
	}
}
