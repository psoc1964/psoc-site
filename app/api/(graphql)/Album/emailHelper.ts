import { Resend } from 'resend';
import { db } from '@/app/api/lib/db/index';
import { sql } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewAlbumEmail(
  albumName: string,
  albumUrl: string,
  thumbnailUrl?: string
) {
  // Raw SQL — no schema file needed
  const activeSubscribers = await db.execute<{ email: string; name: string }>(
  sql`SELECT email, name FROM subscribers WHERE is_active = true`
);

const rows = activeSubscribers as { email: string; name: string }[];

  if (rows.length === 0) return { sent: 0 };

  await resend.batch.send(
    rows.map(({ email, name }) => ({
      from: 'team@psocbitm.com',
      to: email,
      subject: `New Album: ${albumName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#000;color:#fff;padding:24px;border-radius:12px">
          <h2>New Album Released!</h2>
          <p>Hi ${name},</p>
         
          <p>A new album <strong>${albumName}</strong> has just been published.</p>
          <a href="${albumUrl}" style="background:#fff;color:#000;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:10px;font-weight:bold">
            View Album →
          </a>
          <p style="margin-top:24px;font-size:12px;color:#666">
            You're receiving this because you subscribed to PSOC updates.
          </p>
        </div>
      `,
    }))
  );

  return { sent: rows.length };
}