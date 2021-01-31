// This must be the first import for TypeGraphQL to work
import 'reflect-metadata';

import express from 'express';
import morgan from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';

import { PostResolver } from './resolvers/post.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { __PORT__, __PROD__ } from './constants';

export interface Context {
	prisma: PrismaClient;
}

const prisma = new PrismaClient({
	log: __PROD__ ? ['query', 'error', 'info', 'warn'] : [],
});

let main = async () => {
	try {
		const app = express();

		if (!__PROD__) app.use(morgan('dev'));

		const apolloServer = new ApolloServer({
			schema: await buildSchema({
				resolvers: [UserResolver, PostResolver],
				validate: false,
			}),
			context: (): Context => ({ prisma }),
			playground: !__PROD__,
		});

		apolloServer.applyMiddleware({ app });

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
