// This must be the first import for TypeGraphQL to work
import 'reflect-metadata';

import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { PrismaClient } from '@prisma/client';

// import { PostResolver } from './resolvers/post.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { Context } from './types/Context';
import {
	__COOKIE_NAME__,
	__PORT__,
	__PROD__,
	__REDIS_SECRET__,
} from './constants';

const prisma = new PrismaClient({
	log: __PROD__ ? [] : ['query', 'error', 'info', 'warn'],
});

const main = async () => {
	try {
		const app = express();

		// Allows CORS for all routes on the client
		app.use(
			cors({
				origin: 'http://localhost:3000',
				credentials: true,
			}),
		);

		if (!__PROD__) app.use(morgan('dev'));

		// Throws if the redis secret isn't set
		if (!__REDIS_SECRET__) {
			throw new Error('Redis Secret Environment Variable is Undefined');
		}

		const RedisStore = connectRedis(session);
		const redis = new Redis();

		// Applies redis store - session middleware
		app.use(
			session({
				name: __COOKIE_NAME__,
				store: new RedisStore({
					client: redis,
					disableTouch: true,
				}),
				cookie: {
					maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year
					httpOnly: true,
					secure: __PROD__,
					sameSite: 'lax',
				},
				saveUninitialized: false,
				secret: __REDIS_SECRET__,
				resave: false,
			}),
		);

		// Sets up apollo server middleware
		const apolloServer = new ApolloServer({
			schema: await buildSchema({
				resolvers: [UserResolver],
				validate: false,
			}),
			context: ({ req, res }): Context => ({
				prisma,
				redis: redis,
				req,
				res,
			}),
			playground: !__PROD__,
		});

		// Applies the apollos server middleware
		apolloServer.applyMiddleware({
			app,
			cors: false,
		});

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
