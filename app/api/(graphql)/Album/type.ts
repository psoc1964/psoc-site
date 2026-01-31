import { Field, ObjectType } from "type-graphql";

@ObjectType("Album")
export class AlbumGQL {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  albumUrl?: string;

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field()
  isPublished: boolean;

  @Field()
  createdAt: Date;
}
