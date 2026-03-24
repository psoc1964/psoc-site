import { Query, Resolver } from "type-graphql";

import { AlbumGQL } from "./type";
import { handleGetPublishedAlbums } from "./resolvers/get-published-albums";
import { handleGetUnpublishedAlbums } from "./resolvers/get-unpublished-albums";
import { handleGetFeaturedAlbums } from "./resolvers/get-featured-albums";  // ← add

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

  @Query(() => [AlbumGQL])                                                  // ← add
  async getFeaturedAlbums() {
    return handleGetFeaturedAlbums();
  }
}