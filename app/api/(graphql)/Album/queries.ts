import { Query, Resolver } from "type-graphql";

import { AlbumGQL } from "./type";
import { handleGetPublishedAlbums } from "./resolvers/get-published-albums";
import { handleGetUnpublishedAlbums } from "./resolvers/get-unpublished-albums";
import { handleGetFeaturedAlbums } from "./resolvers/get-featured-albums";
import { handleGetAuthenticAlbums } from "./resolvers/isauthentic";

@Resolver()
export class AlbumQueryResolver {
  @Query(() => [AlbumGQL])
  async getPublishedAlbums() {
    return handleGetPublishedAlbums();
  }

  @Query(() => [AlbumGQL])
  async getUnpublishedAlbums() {
    return handleGetUnpublishedAlbums();
  }

  @Query(() => [AlbumGQL])  
  async getFeaturedAlbums() {
    return handleGetFeaturedAlbums();
  }

@Query(() => [AlbumGQL])
  async  GetAuthenticAlbums() {
    return handleGetAuthenticAlbums();
  }
}