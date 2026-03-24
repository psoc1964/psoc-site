import { db } from "@/app/api/lib/db";
import { and, eq, inArray } from "drizzle-orm";
import { AlbumTable } from "../db";
import { FEATURED_ALBUMS } from "../utils";

export async function handleGetFeaturedAlbums() {
  if (FEATURED_ALBUMS.length === 0) {
    return [];
  }

  const albums = await db
    .select()
    .from(AlbumTable)
    .where(
      and(
        inArray(AlbumTable.name, FEATURED_ALBUMS),
        eq(AlbumTable.isPublished, true),
      ),
    );

  if (albums.length === 0) {
    return [];
  }

  const latestByName = new Map<string, (typeof albums)[number]>();

  for (const album of albums) {
    const key = album.name.toUpperCase();
    const existing = latestByName.get(key);

    if (!existing || album.createdAt > existing.createdAt) {
      latestByName.set(key, album);
    }
  }

  return Array.from(latestByName.values());
}
