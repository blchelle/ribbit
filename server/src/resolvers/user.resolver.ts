import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	Query,
	Resolver,
} from 'type-graphql';
import { User } from '../models/user.model';
import argon2 from 'argon2';

import { Context } from '../index';

@InputType()
class UsernamePasswordInput implements Partial<User> {
	@Field()
	username: string;

	@Field()
	password: string;
}

@Resolver()
export class UserResolver {
	/**
	 * Attempts to register a user account given a username and password
	 * @param options The username and password
	 * @param prisma The prisma client
	 */
	@Mutation(() => User)
	async register(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { prisma }: Context,
	) {
		// Generates a hash of the users password
		const hashedPassword = await argon2.hash(options.password);

		// Attempts to write the user to the db
		const user = await prisma.user.create({
			data: { username: options.username, password: hashedPassword },
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
}
