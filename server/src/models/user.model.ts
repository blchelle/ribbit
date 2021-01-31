import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
	@Field()
	id!: number;

	@Field(() => String)
	createdAt = new Date();

	@Field(() => String)
	updatedAt = new Date();

	@Field()
	username!: String;

	password!: String;
}
