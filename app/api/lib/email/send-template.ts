import { getRenderedTemplate } from "@backend/lib/email/html";
import { getRenderedTemplateText } from "@backend/lib/email/text";
import { EmailComponent } from "@backend/lib/email/types";

import { sendEmail } from "./driver";
// import { DeleteUser } from "./templates/delete-user";
import { AlbumReleaseEmail } from "./templates/album-release";
// import { PasswordChange } from "./templates/password-change";
// import { ResetPassword } from "./templates/reset-password";
import { VerifyEmail } from "./templates/verify";
// import { WelcomeUser } from "./templates/welcome";

export const Template = {
  // WelcomeUser,
  // DeleteUser,
  VerifyEmail,
  // ResetPassword,
  // PasswordChange,
  AlbumReleaseEmail,
};

export function sendTemplateEmail<T extends keyof typeof Template>(
  to: string,
  template: T,
  meta: Parameters<(typeof Template)[T]>[0],
) {
  return sendEmail(
    getTemplate(template, [
      {
        to,
        meta,
      },
    ]),
  );
}

export function getTemplate<T extends keyof typeof Template>(
  template: T,
  data: {
    to: string;
    meta: Parameters<(typeof Template)[T]>[0];
  }[],
) {
  return data.map(({ to, meta }) => {
    const method: {
      subject: string;
      title?: string;
      components: EmailComponent[];
    } =
      // @ts-expect-error -- dynamic
      Template[template](meta);
    return {
      to,
      subject: method.subject,
      text: getRenderedTemplateText(
        method.title || method.subject,
        method.components,
      ),
      html: getRenderedTemplate(
        method.title || method.subject,
        method.components,
      ),
    };
  });
}

export function sendBatchTemplateEmail<T extends keyof typeof Template>(
  template: T,
  data: {
    to: string;
    meta: Parameters<(typeof Template)[T]>[0];
  }[],
) {
  return sendEmail(getTemplate(template, data));
}
