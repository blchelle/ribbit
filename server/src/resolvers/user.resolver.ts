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

import { __PROD__ } from '../constants';
import { Context } from '../index';
import { User } from '../models/user.model';
import { FieldError } from '../models/error.model';
import {
	validatePasswordMatch,
	validatePasswordStrength,
	validateUserDoesNotExist,
} from '../validators/user.validators';

/**
 * Input structure for methods that require a username and password
 */
@InputType()
class UsernamePasswordInput implements Partial<User> {
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
	 * @param prisma The prisma client
	 */
	@Query(() => UserResponse)
	async login(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { prisma }: Context,
	): Promise<UserResponse> {
		// Pulls the username and password off of the options
		const { username, password } = options;

		// Attempts to find a user with the passed in username
		const user = await prisma.user.findUnique({
			where: { username },
		});

		// Sends an error if the username wasn't found
		if (!user) {
			return {
				errors: [
					{
						field: 'username',
						message: `Could not find a user with the username ${username}`,
					},
				],
			};
		}

		// Checks that the password matches
		const errors = await validatePasswordMatch(user.password, password);

		if (errors.length > 0) {
			return { errors };
		}

		// If the code reaches here, the user exists and the password matches
		// Sends the user their information
		return { user };
	}

	/**
	 * Attempts to register a user account given a username and password
	 * @param options The username and password
	 * @param prisma The prisma client
	 */
	@Mutation(() => UserResponse)
	async register(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { prisma }: Context,
	): Promise<UserResponse> {
		// Pulls the username and password off of the options
		const { username, password } = options;

		// Used to keep track of any errors that occur
		const errors = [
			...(await validateUserDoesNotExist(username, prisma)),
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
			data: { username, password: hashedPassword },
		});

		return { user };
	}
}
