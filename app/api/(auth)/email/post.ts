import { Roles } from "@backend/lib/constants/roles";
import { handleSendVerificationEmail } from "@graphql/Request/resolvers/send-verification-email";
import { UserTable } from "@graphql/User/db";
import { createUser, getUser } from "@graphql/User/utils";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

import { ErrorResponses } from "../../lib/auth/error-responses";
import {
  generateAccessToken,
  generateRefreshToken,
  getTokenizedResponse,
} from "../../lib/auth/token";
import { verifyUser } from "./put";

export const POST = async (req: Request) => {
  const body = (await req.json()) as {
    email?: string;
    password?: string;
    name?: string;
  };

  if (!body.email || !body.password) return ErrorResponses.missingBodyFields;
  const email = body.email.toLowerCase().trim();
  const existingUser = await getUser(eq(UserTable.email, email));
  if (existingUser) {
    if (await verifyUser(existingUser, body.password)) {
      return getTokenizedResponse(
        generateAccessToken(existingUser.id),
        generateRefreshToken(existingUser.id),
      );
    }
    return ErrorResponses.alreadyExists;
  }

  const encryptedPassword = await hash(body.password, 10);
  const newUser = await createUser({
    email,
    name: body.name?.trim() || null,
    password: encryptedPassword,
    role: Roles.Stu,
    emailVerified: false,
  });

  if (newUser) {
    try {
      await handleSendVerificationEmail(newUser.id);
    } catch (error) {
      console.error("Error sending verification email during signup:", error);
    }

    return getTokenizedResponse(
      generateAccessToken(newUser.id),
      generateRefreshToken(newUser.id),
    );
  }
  return getTokenizedResponse();
};
