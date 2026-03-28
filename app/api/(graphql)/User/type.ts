import { Field, ObjectType } from "type-graphql";

@ObjectType("User")
export class UserGQL {
  @Field()
  id: number;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  email?: string;
  @Field()
  emailVerified: boolean;
  @Field()
  role: string;
}
