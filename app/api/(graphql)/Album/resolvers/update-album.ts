import type { AuthorizedContext } from "@backend/lib/auth/context";
import GQLError from "@backend/lib/constants/errors";
import { db } from "@/app/api/lib/db";
import { eq } from "drizzle-orm";
import { convertAlbumThumbnail, ensureAdmin } from "../utils";

import type { AlbumDBInsert, AlbumDB } from "../db";
import { AlbumTable } from "../db";

export async function handleUpdateAlbum(
  ctx: AuthorizedContext,
  id: number,
  data: Partial<
    Pick<
      AlbumDBInsert,
      "name" | "albumUrl" | "thumbnailUrl" | "isPublished" | "featuredAlbum"
    >
  >,
): Promise<AlbumDB> {
  await ensureAdmin(ctx);

  const values: Partial<AlbumDBInsert> = {};
  if (typeof data.name === "string") values.name = data.name;
  if (typeof data.albumUrl === "string") values.albumUrl = data.albumUrl;
  if (typeof data.thumbnailUrl === "string")
    values.thumbnailUrl = convertAlbumThumbnail(data.thumbnailUrl);
  if (typeof data.isPublished === "boolean")
    values.isPublished = data.isPublished;
  if (typeof data.featuredAlbum === "boolean")
    values.featuredAlbum = data.featuredAlbum;

  if (Object.keys(values).length === 0) {
    throw GQLError(400, "No fields provided to update");
  }

  const [album] = await db
    .update(AlbumTable)
    .set(values)
    .where(eq(AlbumTable.id, id))
    .returning();

  if (!album) {
    throw GQLError(404, "Album not found");
  }

  return album;
}
