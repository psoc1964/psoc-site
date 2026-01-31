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
    @Arg("url", { nullable: true }) url?: string,
    @Arg("isPublished", { nullable: true }) isPublished?: boolean,
  ) {
    return handleCreateAlbum(ctx, { name, url, isPublished });
  }

  @Authorized()
  @Mutation(() => AlbumGQL)
  async updateAlbum(
    @Ctx() ctx: AuthorizedContext,
    @Arg("id") id: number,
    @Arg("name", { nullable: true }) name?: string,
    @Arg("url", { nullable: true }) url?: string,
    @Arg("isPublished", { nullable: true }) isPublished?: boolean,
  ) {
    return handleUpdateAlbum(ctx, id, { name, url, isPublished });
  }
}
