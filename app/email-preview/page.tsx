import { VerifyEmail } from "@/app/api/lib/email/templates/verify";
import { getRenderedVerifyTemplate } from "@/app/api/lib/email/html-verify";

export default function EmailPreview() {
  const email = VerifyEmail({
    firstName: "Anshuman",
    link: "https://psocbitm.com",
  });

  const html = getRenderedVerifyTemplate(
    email.title || email.subject,
    email.components
  );

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}