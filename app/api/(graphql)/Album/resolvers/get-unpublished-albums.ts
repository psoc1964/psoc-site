import { db } from "@/app/api/lib/db";
import { eq } from "drizzle-orm";

import type { AlbumDB } from "../db";
import { AlbumTable } from "../db";

export async function handleGetUnpublishedAlbums(): Promise<AlbumDB[]> {
  const albums = await db
    .select()
    .from(AlbumTable)
    .where(eq(AlbumTable.isPublished, false));

  return albums;
}