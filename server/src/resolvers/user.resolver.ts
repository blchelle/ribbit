import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from 'type-graphql';
import argon2 from 'argon2';

import { __COOKIE_NAME__, __PROD__ } from '../constants';
import { Context } from '../index';
import { User } from '../models/user.model';
import { FieldError } from '../models/error.model';
import {
	validatePasswordMatch,
	validatePasswordStrength,
	validateNewUsername,
	validateNewEmail,
} from '../validators/user.validators';

/**
 * Input structure for methods that require a username and password
 */
@InputType()
class LoginInput implements Partial<User> {
	/**
	 * Either the username or email address
	 */
	@Field()
	credential: string;

	@Field()
	password: string;
}

@InputType()
class RegisterInput implements Partial<User> {
	@Field()
	email: string;

	@Field()
	username: string;

	@Field()
	password: string;
}

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
		@Arg('options') options: LoginInput,
		@Ctx() { prisma, req }: Context,
	): Promise<UserResponse> {
		// Pulls the username and password off of the options
		const { credential, password } = options;

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
		const errors = await validatePasswordMatch(user.password, password);

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
	logout(@Ctx() { req, res }: Context): Promise<Boolean> {
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
		@Arg('options') options: RegisterInput,
		@Ctx() { prisma, req }: Context,
	): Promise<UserResponse> {
		// Pulls the username and password off of the options
		let { email, username, password } = options;

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
}
