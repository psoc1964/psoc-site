import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class AlbumGQL {
  @Field(() => Int)          id: number;
  @Field()                   name: string;
  @Field()                   albumUrl?: string;
  @Field({ nullable: true }) thumbnailUrl?: string;
  @Field()                   isPublished: boolean;
  @Field()                   featuredAlbum: boolean;
  @Field()                   createdAt: Date;
  @Field()                   isauthentic:boolean;
}