import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class AlbumGQL {
  @Field(() => Int)          id: number;
  @Field()                   name: string;
  @Field({ nullable: true }) albumUrl?: string;
  @Field({ nullable: true }) thumbnailUrl?: string;
  @Field()                   isPublished: boolean;
  @Field()                   featured_album: boolean;   // ← add this
  @Field()                   createdAt: Date;
}