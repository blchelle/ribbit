// This must be the first import for TypeGraphQL to work
import 'reflect-metadata';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';

import { HelloResolver } from './resolvers/hello';
import { __PORT__, __PROD__ } from './constants';

const prisma = new PrismaClient({
	log: __PROD__ ? ['query', 'error', 'info', 'warn'] : [],
});

let main = async () => {
	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver],
			validate: false,
		}),
	});

	apolloServer.applyMiddleware({ app });

	app.get('/', (_, res) => res.send('hello'));
	app.listen(__PORT__, () => console.log(`Listening on port ${__PORT__}`));
};

main()
	.catch((e) => {
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
