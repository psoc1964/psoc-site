import type { AuthorizedContext } from "@backend/lib/auth/context";
import GQLError from "@backend/lib/constants/errors";
import { db } from "@/app/api/lib/db";
import { convertAlbumThumbnail, ensureAdmin } from "../utils";

import type { AlbumDBInsert, AlbumDB } from "../db";
import { AlbumTable } from "../db";

export async function handleCreateAlbum(
  ctx: AuthorizedContext,
  data: Pick<
    AlbumDBInsert,
    "name" | "albumUrl" | "thumbnailUrl" | "isPublished" | "featuredAlbum"
  >,
): Promise<AlbumDB> {
  await ensureAdmin(ctx);

  let album: AlbumDB | undefined;
  try {
    [album] = await db
      .insert(AlbumTable)
      .values({
        name: data.name,
        albumUrl: data.albumUrl,
        thumbnailUrl: data.thumbnailUrl
          ? convertAlbumThumbnail(data.thumbnailUrl)
          : undefined,
        isPublished: data.isPublished ?? false,
        featuredAlbum: data.featuredAlbum ?? false,
      })
      .returning();
  } catch (error: unknown) {
    const message =
      error && typeof error === "object" && "cause" in error
        ? String((error as any).cause?.message || (error as any).message)
        : "Failed to insert album";
    throw GQLError(500, message);
  }

  if (!album) {
    throw GQLError(500);
  }

  return album;
}
