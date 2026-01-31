import type { AuthorizedContext } from "@backend/lib/auth/context";
import GQLError from "@backend/lib/constants/errors";
import { db } from "@/app/api/lib/db";
import { ensureAdmin } from "../utils";

import type { AlbumDBInsert, AlbumDB } from "../db";
import { AlbumTable } from "../db";

export async function handleCreateAlbum(
  ctx: AuthorizedContext,
  data: Pick<
    AlbumDBInsert,
    "name" | "albumUrl" | "thumbnailUrl" | "isPublished"
  >,
): Promise<AlbumDB> {
  await ensureAdmin(ctx);

  const [album] = await db
    .insert(AlbumTable)
    .values({
      name: data.name,
      albumUrl: data.albumUrl,
      thumbnailUrl: data.thumbnailUrl,
      isPublished: data.isPublished ?? false,
    })
    .returning();

  if (!album) {
    throw GQLError(500);
  }

  return album;
}
