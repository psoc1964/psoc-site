import { db } from "@/app/api/lib/db";
import { eq } from "drizzle-orm";
import { AlbumTable } from "../db";

export async function handleGetAuthenticAlbums() {
  const albums = await db
    .select()
    .from(AlbumTable)
    .where(eq(AlbumTable.isauthentic, true));

  if (albums.length === 0) {
    return [];
  }

  return albums;
}