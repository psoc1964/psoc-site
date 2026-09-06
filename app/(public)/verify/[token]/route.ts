import { generateRefreshToken } from "@/app/api/lib/auth/token";
import { db } from "@backend/lib/db";
import { DAY } from "@backend/lib/utils/time";
import { RequestTable, RequestType } from "@graphql/Request/db";
import { UserTable } from "@graphql/User/db";
import { and, eq } from "drizzle-orm";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${baseURL}/login?error=invalid_token`);
  }

  try {
    const data = verify(token, process.env.SIGNING_KEY || "") as {
      id: number;
      userId?: number;
    } | null;

    if (!data?.id) {
      return NextResponse.redirect(`${baseURL}/login?error=invalid_token`);
    }

    const [res] = await db
      .select()
      .from(RequestTable)
      .where(
        and(
          eq(RequestTable.id, data.id),
          eq(RequestTable.type, RequestType.VerifyEmail),
        ),
      )
      .innerJoin(UserTable, eq(UserTable.id, RequestTable.user));

    let userId: number | null = null;

    if (res) {
      if (new Date().getTime() - res.request.createdAt.getTime() > 2 * DAY) {
        return NextResponse.redirect(`${baseURL}/login?error=token_expired`);
      }

      userId = res.user.id;

      // Mark user as verified
      await db
        .update(UserTable)
        .set({ emailVerified: true })
        .where(eq(UserTable.id, userId));

      // Remove the used request record
      await db.delete(RequestTable).where(eq(RequestTable.id, data.id));
    } else if (data.userId) {
      // If already verified previously, still allow logging in
      const [existingUser] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.id, data.userId));

      if (existingUser && existingUser.emailVerified) {
        userId = existingUser.id;
      }
    }

    if (!userId) {
      return NextResponse.redirect(`${baseURL}/login?error=request_not_found`);
    }

    // Generate refresh token and set cookie on response
    const refreshToken = generateRefreshToken(userId);
    const response = NextResponse.redirect(`${baseURL}/?loggedin=true`);

    if (refreshToken) {
      response.cookies.set("refresh", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000),
      });
    }

    return response;
  } catch (error) {
    console.error("Email verification route error:", error);
    return NextResponse.redirect(`${baseURL}/login?error=verification_failed`);
  }
}
