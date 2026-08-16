import type { AuthorizedContext } from "@backend/lib/auth/context";
import GQLError from "@backend/lib/constants/errors";
import { db } from "@/app/api/lib/db";
import { eq } from "drizzle-orm";
import { convertAlbumThumbnail, ensureAdmin } from "../utils";
import { sendBatchTemplateEmail } from "@backend/lib/email/send-template";
import { EMAIL_REGEX } from "@/constants/validations";

import type { AlbumDBInsert, AlbumDB } from "../db";
import { AlbumTable } from "../db";

type UpdateAlbumInput = Partial<
  Pick<
    AlbumDBInsert,
    | "name"
    | "albumUrl"
    | "thumbnailUrl"
    | "isPublished"
    | "featuredAlbum"
    | "isauthentic"
  >
> & {
  sendEmail?: string | null; // Added so admins can pass emails when updating an old album
};

const MAX_BATCH_EMAIL_RECIPIENTS = 50;

function parseRecipientEmails(sendEmail?: string | null) {
  const recipients = (sendEmail || "")
    .split(/[\n,;]+/)
    .map((value) => value.trim())
    .filter(Boolean);

  const uniqueRecipients = [...new Set(recipients)];

  if (uniqueRecipients.length > MAX_BATCH_EMAIL_RECIPIENTS) {
    throw GQLError(
      400,
      `You can notify at most ${MAX_BATCH_EMAIL_RECIPIENTS} recipients at once`,
    );
  }

  for (const recipient of uniqueRecipients) {
    if (!EMAIL_REGEX.test(recipient)) {
      throw GQLError(400, `Invalid email address: ${recipient}`);
    }
  }

  return uniqueRecipients;
}

export async function handleUpdateAlbum(
  ctx: AuthorizedContext,
  id: number,
  data: UpdateAlbumInput,
): Promise<AlbumDB> {
  await ensureAdmin(ctx);

  // Validate recipient emails if any are provided during the update
  let parsedRecipientEmails: string[] = [];
  if (data.sendEmail) {
    try {
      parsedRecipientEmails = parseRecipientEmails(data.sendEmail);
    } catch (err) {
      console.warn("Recipient email validation failed during update:", err);
    }
  }

  const values: Partial<AlbumDBInsert> = {};
  if (typeof data.name === "string") values.name = data.name;
  if (typeof data.albumUrl === "string") values.albumUrl = data.albumUrl;
  if (typeof data.thumbnailUrl === "string")
    values.thumbnailUrl = convertAlbumThumbnail(data.thumbnailUrl);
  if (typeof data.isPublished === "boolean")
    values.isPublished = data.isPublished;
  if (typeof data.featuredAlbum === "boolean")
    values.featuredAlbum = data.featuredAlbum;
  if (typeof data.isauthentic === "boolean")
    values.isauthentic = data.isauthentic;

  if (Object.keys(values).length === 0) {
    throw GQLError(400, "No fields provided to update");
  }

  const [album] = await db
    .update(AlbumTable)
    .set(values)
    .where(eq(AlbumTable.id, id))
    .returning();

  if (!album) {
    throw GQLError(404, "Album not found");
  }

  // --- DYNAMIC EMAIL TRIGGER ON UPDATE ---
  // Ensure the album is actually published before sending the email
  const isCurrentlyPublished = values.isPublished ?? album.isPublished;

  if (isCurrentlyPublished && parsedRecipientEmails.length > 0) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const rawDriveUrl = album.albumUrl || `${baseUrl}/album`;
    
    // Wrap the Drive link inside your Verification Access route
    const secureAlbumUrl = `${baseUrl}/api/album/access?redirect=${encodeURIComponent(rawDriveUrl)}`;

    try {
      await sendBatchTemplateEmail(
        "AlbumReleaseEmail",
        parsedRecipientEmails.map((recipientEmail) => ({
          to: recipientEmail,
          meta: {
            albumTitle: album.name,
            albumCoverUrl: album.thumbnailUrl || `${baseUrl}/meet1.png`,
            albumUrl: secureAlbumUrl,
            collectionName: album.name.toUpperCase(),
            year: new Date(album.createdAt).getFullYear().toString(),
            status: "NOW LIVE",
          },
        })),
      );
    } catch (error) {
      console.error("Failed to send album release email on update:", error);
    }
  }

  return album;
}