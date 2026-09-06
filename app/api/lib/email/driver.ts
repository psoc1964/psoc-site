import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  emails: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }[],
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured. Email skipped.");
    return null;
  }

  if (emails.length > 1) {
    const res = await resend.batch.send(
      emails.slice(0, 100).map((data) => ({
        from: "PSOC <noreply@psocbitm.com>",
        ...data,
      })),
    );
    if (res.error) {
      console.error("Resend batch email error:", res.error);
    }
    return res;
  }

  const email = emails[0];
  if (!email) return null;

  if (
    !process.env.NEXT_PUBLIC_DEVELOPMENT &&
    !(email.to.startsWith("test") && email.to.endsWith("psocbitm.com"))
  ) {
    const res = await resend.emails.send({
      from: "PSOC <noreply@psocbitm.com>",
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
    if (res.error) {
      console.error("Resend send email error:", res.error);
    }
    return res;
  }
}
