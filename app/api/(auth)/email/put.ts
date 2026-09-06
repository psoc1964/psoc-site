import { UserDB, UserTable } from "@graphql/User/db";
import { getUser } from "@graphql/User/utils";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";

import { ErrorResponses } from "../../lib/auth/error-responses";
import {
  generateAccessToken,
  generateRefreshToken,
  getTokenizedResponse,
} from "../../lib/auth/token";

export async function verifyUser(user: UserDB, password: string): Promise<boolean> {
  if (!user.password) return false;
  return compare(password, user.password);
}

export const PUT = async (req: Request) => {
  const body = (await req.json()) as {
    email?: string;
    password?: string;
  };

  if (!body.email || !body.password) return ErrorResponses.missingBodyFields;
  const user = await getUser(eq(UserTable.email, body.email.toLowerCase().trim()));
  if (!user) return ErrorResponses.wrongCredentials;
  if (await verifyUser(user, body.password)) {
    return getTokenizedResponse(
      generateAccessToken(user.id),
      generateRefreshToken(user.id),
    );
  }
  return ErrorResponses.wrongCredentials;
};
