import { Field, ObjectType } from "type-graphql";

@ObjectType("Album")
export class AlbumGQL {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  url?: string;

  @Field()
  isPublished: boolean;

  @Field()
  createdAt: Date;
}
