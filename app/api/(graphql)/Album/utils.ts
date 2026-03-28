import { Roles } from "@backend/lib/constants/roles";
import { UserTable } from "@graphql/User/db";
import { getUser } from "@graphql/User/utils";
import { AuthorizedContext } from "../../lib/auth/context";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import GQLError from "../../lib/constants/errors";

export const FEATURED_ALBUMS: string[] = ["Utkrisht", "Batch Photography"];

export function convertAlbumThumbnail(url: string): string {
  if (!url) return "";

  try {
    let fileId: string | null = null;

    const fileMatch = url.match(/\/d\/([^/]+)/);
    if (fileMatch?.[1]) fileId = fileMatch[1];

    const openMatch = url.match(/[?&]id=([^&]+)/);
    if (!fileId && openMatch?.[1]) fileId = openMatch[1];

    if (!fileId) return url;

    return `/api/drive-image?id=${fileId}`;
  } catch (error) {
    console.error("Album thumbnail conversion failed:", error);
    return url;
  }
}

export async function ensureAdmin(ctx: AuthorizedContext) {
  const user = await getUser(eq(UserTable.id, ctx.userId));
  if (!user || user.role !== Roles.Admin) {
    throw GQLError(403, "You are not allowed to perform this action");
  }
}
