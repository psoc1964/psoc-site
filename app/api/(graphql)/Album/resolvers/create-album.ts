import type { AuthorizedContext } from "@backend/lib/auth/context";
import GQLError from "@backend/lib/constants/errors";
import {
  sendBatchTemplateEmail,
  sendTemplateEmail,
} from "@backend/lib/email/send-template";
import { EMAIL_REGEX } from "@/constants/validations";
import { db } from "@/app/api/lib/db";
import { ensureAdmin } from "../utils";

import type { AlbumDBInsert, AlbumDB } from "../db";
import { AlbumTable } from "../db";

type CreateAlbumInput = Pick<
  AlbumDBInsert,
  | "name"
  | "albumUrl"
  | "thumbnailUrl"
  | "isPublished"
  | "featuredAlbum"
  | "isauthentic"
> & {
  sendEmail?: string | null;
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

export async function handleCreateAlbum(
  ctx: AuthorizedContext,
  data: CreateAlbumInput,
): Promise<AlbumDB> {
  await ensureAdmin(ctx);
  // Validate recipient emails first. If invalid, we'll still insert the album
  // but persist it as unpublished (isPublished = false) per user request.
  let emailsValid = true;
  let parsedRecipientEmails: string[] = [];
  if (data.isPublished) {
    try {
      parsedRecipientEmails = parseRecipientEmails(data.sendEmail);
    } catch (err) {
      // mark invalid but do not throw; album will be inserted as unpublished
      emailsValid = false;
      console.warn("Recipient email validation failed, inserting as unpublished:", err);
    }
  }

  const shouldPublish = Boolean(data.isPublished && emailsValid);

  let album: AlbumDB | undefined;
  try {
    [album] = await db
      .insert(AlbumTable)
      .values({
        name: data.name,
        albumUrl: data.albumUrl,
        thumbnailUrl: data.thumbnailUrl ? data.thumbnailUrl : undefined,
        isPublished: shouldPublish ?? false,
        featuredAlbum: data.featuredAlbum ?? false,
        isauthentic: data.isauthentic ?? false,
      })
      .returning();
  } catch (error: unknown) {
    const message =
      error && typeof error === "object" && "cause" in error
        ? String((error as any).cause?.message || (error as any).message)
        : "Failed to insert album";
    throw GQLError(500, message);
  }

  if (!album) {
    throw GQLError(500);
  }

  if (shouldPublish && parsedRecipientEmails.length > 0) {
    const albumUrl =
      album.albumUrl || `${process.env.NEXT_PUBLIC_BASE_URL || ""}/album`;
    try {
      await sendBatchTemplateEmail(
        "AlbumReleaseEmail",
        parsedRecipientEmails.map((recipientEmail) => ({
          to: recipientEmail,
          meta: {
            albumName: album.name,
            albumUrl,
          },
        })),
      );
    } catch (error) {
      console.error("Failed to send album release email:", error);
    }
  }

  return album;
}
