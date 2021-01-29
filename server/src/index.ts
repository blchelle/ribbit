// This must be the first import for TypeGraphQL to work
import 'reflect-metadata';

import express from 'express';
import morgan from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';

import { resolvers } from '@generated/type-graphql';
import { __PORT__, __PROD__ } from './constants';

const prisma = new PrismaClient({
	log: __PROD__ ? ['query', 'error', 'info', 'warn'] : [],
});

let main = async () => {
	const app = express();

	if (!__PROD__) app.use(morgan('dev'));

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers,
			validate: false,
		}),
		context: () => ({ prisma }),
		playground: !__PROD__,
	});

	apolloServer.applyMiddleware({ app });

	app.listen(__PORT__, () => console.log(`Listening on port ${__PORT__}`));
};

main()
	.catch((e) => {
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
