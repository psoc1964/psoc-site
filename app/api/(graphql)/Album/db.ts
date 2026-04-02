import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const AlbumTable = pgTable(
  "album",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    albumUrl: text("album_url"),
    thumbnailUrl: text("thumbnail_url"),
    isPublished: boolean("is_published").default(false).notNull(),
    featuredAlbum: boolean("featured_album").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isauthentic: boolean("isauthentic").notNull().default(false),
  },
  (table) => ({
    albumSearchNameIndex: index("album_search_name_index").using(
      "gin",
      sql`${table.name} gin_trgm_ops`,
    ),
  }),
);

export type AlbumDBInsert = typeof AlbumTable.$inferInsert;
export type AlbumDB = typeof AlbumTable.$inferSelect;