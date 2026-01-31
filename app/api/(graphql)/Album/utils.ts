import { Roles } from "@backend/lib/constants/roles";
import { UserTable } from "@graphql/User/db";
import { getUser } from "@graphql/User/utils";
import { AuthorizedContext } from "../../lib/auth/context";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import GQLError from "../../lib/constants/errors";
export async function ensureAdmin(ctx: AuthorizedContext) {
  const user = await getUser(eq(UserTable.id, ctx.userId));
  if (!user || user.role !== Roles.Admin) {
    throw GQLError(403, "You are not allowed to perform this action");
  }
}