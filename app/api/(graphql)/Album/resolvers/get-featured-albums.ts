import { db } from "@/app/api/lib/db";
import { eq } from "drizzle-orm";
import { AlbumTable } from "../db";

export async function handleGetFeaturedAlbums() {
  return await db
    .select()
    .from(AlbumTable)
    .where(eq(AlbumTable.featured_album, true));
}