import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Post {
	@Field()
	id!: number;

	@Field(() => String)
	createdAt = new Date();

	@Field(() => String)
	updatedAt = new Date();

	@Field()
	title!: String;
}
