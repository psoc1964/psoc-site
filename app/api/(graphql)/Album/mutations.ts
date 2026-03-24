import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";

import { AlbumGQL } from "./type";
import type { AuthorizedContext } from "@backend/lib/auth/context";
import { handleCreateAlbum } from "./resolvers/create-album";
import { handleUpdateAlbum } from "./resolvers/update-album";

@Resolver()
export class AlbumMutationResolver {
  @Authorized()
  @Mutation(() => AlbumGQL)
  async createAlbum(
    @Ctx() ctx: AuthorizedContext,
    @Arg("name") name: string,
    @Arg("albumUrl", { nullable: true }) albumUrl?: string,
    @Arg("thumbnailUrl", { nullable: true }) thumbnailUrl?: string,
    @Arg("isPublished", { nullable: true }) isPublished?: boolean,
    @Arg("featuredAlbum", { nullable: true }) featuredAlbum?: boolean,
  ) {
    return handleCreateAlbum(ctx, {
      name,
      albumUrl,
      thumbnailUrl,
      isPublished,
      featuredAlbum,
    } as any);
  }

  @Authorized()
  @Mutation(() => AlbumGQL)
  async updateAlbum(
    @Ctx() ctx: AuthorizedContext,
    @Arg("id") id: number,
    @Arg("name", { nullable: true }) name?: string,
    @Arg("albumUrl", { nullable: true }) albumUrl?: string,
    @Arg("thumbnailUrl", { nullable: true }) thumbnailUrl?: string,
    @Arg("isPublished", { nullable: true }) isPublished?: boolean,
    @Arg("featuredAlbum", { nullable: true }) featuredAlbum?: boolean,
  ) {
    return handleUpdateAlbum(ctx, id, {
      name,
      albumUrl,
      thumbnailUrl,
      isPublished,
      featuredAlbum,
    } as any);
  }
}
