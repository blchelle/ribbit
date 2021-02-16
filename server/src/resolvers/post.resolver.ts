// import { Context } from '../types/Context';
// import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
// import { Post } from '../models/post.model';

// @Resolver()
// export class PostResolver {
// 	/**
// 	 * Executes a GraphQL query, finds all posts in the db
// 	 * @param prisma The prisma client
// 	 */
// 	@Query(() => [Post])
// 	async posts(@Ctx() { prisma }: Context) {
// 		return prisma.post.findMany({ where: {} });
// 	}

// 	/**
// 	 * Executes a GraphQL query, finds a post with a specified id
// 	 * @param id The id of the post being queried
// 	 * @param prisma The prisma client
// 	 */
// 	@Query(() => Post, { nullable: true })
// 	async post(@Arg('id') id: number, @Ctx() { prisma }: Context) {
// 		try {
// 			const post = await prisma.post.findFirst({ where: { id } });
// 			return post;
// 		} catch (err) {
// 			return null;
// 		}
// 	}

// 	/**
// 	 * Executes a GraphQL mutation query, attempting to insert a post into the db
// 	 * @param title The title of the post we are creating
// 	 * @param prisma The prisma client
// 	 */
// 	@Mutation(() => Post)
// 	async createPost(@Arg('title') title: string, @Ctx() { prisma }: Context) {
// 		return prisma.post.create({ data: { title } });
// 	}

// 	/**
// 	 * Executes a GraphQL mutation query, attempting to update a post in the db
// 	 * @param id The id of the post to delete
// 	 * @param prisma The prisma client
// 	 */
// 	@Mutation(() => Post, { nullable: true })
// 	async updatePost(
// 		@Arg('id') id: number,
// 		@Arg('title', { nullable: true }) title: string,
// 		@Ctx() { prisma }: Context,
// 	) {
// 		try {
// 			// Throws 'RecordNotFound' error if no post is found
// 			const updatedPost = await prisma.post.update({
// 				where: { id },
// 				data: { title },
// 			});

// 			return updatedPost;
// 		} catch (err) {
// 			return null;
// 		}
// 	}

// 	/**
// 	 * Executes a GraphQL mutation query, attempting to delete a post from the db
// 	 * @param id The id of the post to delete
// 	 * @param prisma The prisma client
// 	 */
// 	@Mutation(() => Boolean, { nullable: true })
// 	async deletePost(@Arg('id') id: number, @Ctx() { prisma }: Context) {
// 		try {
// 			// Throws 'RecordNotFound' error if no post is found
// 			await prisma.post.delete({ where: { id } });

// 			// If the execution reaches here, the post was deleted
// 			return true;
// 		} catch (err) {
// 			return false;
// 		}
// 	}
// }
