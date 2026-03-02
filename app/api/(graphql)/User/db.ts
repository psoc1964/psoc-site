import { Roles } from "@backend/lib/constants/roles";
import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("role", [
  Roles.Admin,
  Roles.Stu,
]);

export const UserTable = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    email: text("email").unique().notNull(),
    emailVerified: boolean("email_verified").default(false),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    role: rolesEnum("role").default(Roles.Stu).notNull(),
  },
  (table) => ({
    userSearchNameIndex: index("user_search_name_index").using(
      "gin",
      sql`${table.name} gin_trgm_ops`,
    ),
    emailIdx: index("email_idx").on(table.email),
  }),
);

export type UserDBInsert = typeof UserTable.$inferInsert;
export type UserDB = typeof UserTable.$inferSelect;
