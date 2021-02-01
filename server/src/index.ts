// This must be the first import for TypeGraphQL to work
import 'reflect-metadata';

import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { PrismaClient } from '@prisma/client';

import { PostResolver } from './resolvers/post.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { __PORT__, __PROD__, __REDIS_SECRET__ } from './constants';

export interface Context {
	prisma: PrismaClient;
}

const prisma = new PrismaClient({
	log: __PROD__ ? [] : ['query', 'error', 'info', 'warn'],
});

const main = async () => {
	try {
		const app = express();

		if (!__PROD__) app.use(morgan('dev'));

		// Throws if the redis secret isn't set
		if (!__REDIS_SECRET__) {
			throw new Error('Redis Secret Environment Variable is Undefined');
		}

		const RedisStore = connectRedis(session);
		const redisClient = redis.createClient();

		// Applies redis store - session middleware
		app.use(
			session({
				name: 'qid',
				store: new RedisStore({ client: redisClient }),
				secret: __REDIS_SECRET__,
				resave: false,
			}),
		);

		// Sets up apollo server middleware
		const apolloServer = new ApolloServer({
			schema: await buildSchema({
				resolvers: [UserResolver, PostResolver],
				validate: false,
			}),
			context: (): Context => ({ prisma }),
			playground: !__PROD__,
		});

		// Applies the apollos server middleware
		apolloServer.applyMiddleware({ app });

		// Start the server
		app.listen(__PORT__, () =>
			console.log(`GraphQL API on port ${__PORT__}`),
		);
	} catch (error) {
		console.log(error);
	}
};

main()
	.catch((e) => {
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
