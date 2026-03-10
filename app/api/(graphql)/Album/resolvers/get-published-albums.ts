import { db } from "@/app/api/lib/db";
import { eq } from "drizzle-orm";

import type { AlbumDB } from "../db";
import { AlbumTable } from "../db";

             // ✅ this now works - lib/db/index.ts

import { convertDriveThumbnail } from "@/app/(private)/lib/utils";

export async function handleGetPublishedAlbums() {
  const albums = await db
    .select()
    .from(AlbumTable)
    .where(eq(AlbumTable.isPublished, true));

  return albums.map((album) => ({
    ...album,
    thumbnailUrl: convertDriveThumbnail(album.thumbnailUrl ?? ""),
  }));
}