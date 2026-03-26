import { db } from "@/app/api/lib/db";
import { eq } from "drizzle-orm";


import { AlbumTable } from "../db";

import { convertAlbumThumbnail } from "../utils";

export async function handleGetPublishedAlbums() {
  const albums = await db
    .select()
    .from(AlbumTable)
    .where(eq(AlbumTable.isPublished, true));

  return albums.map((album) => ({
    ...album,
    thumbnailUrl: convertAlbumThumbnail(album.thumbnailUrl ?? ""),
  }));
}