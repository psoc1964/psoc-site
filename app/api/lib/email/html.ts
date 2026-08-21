import {
  EmailComponent,
  EmailComponentType,
  TemplateLayoutOptions,
} from "@backend/lib/email/types";
import { Resend } from "resend";

export const resend = new Resend(
  process.env.RESEND_API_KEY || "re_dummy_key_for_build"
);

// ============================================================================
// 1. ALBUM RELEASE TEMPLATE (100% UNTOUCHED)
// ============================================================================

function getTemplateLayout(
  content: string[] | string,
  props?: TemplateLayoutOptions,
) {
  return `<table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="border-spacing:0;border-collapse:collapse;max-width:${props?.width ? props.width + "px" : "100%"};margin-bottom:${props?.marginBottom || "1rem"};margin-top:${props?.marginTop || "1rem"};">
    <tr>
      <td style="${props?.style || ""}" align="${props?.align || "left"}">${typeof content === "string" ? content : content.join("")}</td>
    </tr>
  </table>`;
}

function getComponentHTML(component: EmailComponent): string {
  switch (component.type) {
    case EmailComponentType.LIST:
      return getTemplateLayout(
        `<ul style="padding-left:20px; margin: 0;">
          ${(component.items || [])
            .map(
              (item) =>
                `<li style="color:#d1d5db;font-size:20px;margin-bottom:12px;font-family:'Cormorant Garamond', Georgia, serif;">${item}</li>`
            )
            .join("")}
        </ul>`,
        component.options
      );
    case EmailComponentType.IMAGE:
      return getTemplateLayout(
        `<img src="${component.url || ""}" width="${component.width || ""}" style="width:${component.width ? component.width + "px" : "auto"};border-radius:4px;display:block;border:none;" />`,
        component.options
      );
    case EmailComponentType.GRID:
      return buildTemplate(component.components || []);
    case EmailComponentType.BUTTON:
      return getTemplateLayout(
        `<a href="${component.url || "#"}" target="_blank" style="display:inline-block;background-color:transparent;color:#ffffff;padding:14px 40px;font-size:12px;border-radius:2px;text-decoration:none;font-weight:400;letter-spacing:2px;text-transform:uppercase;border:1px solid #ffffff;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${component.content || ""}</a>`,
        component.options
      );
    case EmailComponentType.HEADING:
      return getTemplateLayout(
        `<h2 style="margin:0;font-size:40px;color:#ffffff;font-weight:500;letter-spacing:0px;font-family:'Cormorant Garamond', Georgia, serif;">${component.content || ""}</h2>`,
        component.options
      );
    case EmailComponentType.PARAGRAPH:
      return getTemplateLayout(
        `<p style="color:#a3a3a3;font-size:20px;line-height:30px;margin:0;font-weight: 400;font-family:'Cormorant Garamond', Georgia, serif;">${(component.content || "").replaceAll("\n", "<br/>")}</p>`,
        component.options
      );
    default:
      return "";
  }
}

function buildTemplate(components: EmailComponent[]) {
  return getTemplateLayout(
    components.map((c) => getComponentHTML(c)).join("")
  );
}

function buildEditorialAlbumTemplate(
  albumTitle: string,
  albumCoverUrl: string,
  collectionName: string,
  year: string,
  status: string,
  albumUrl: string
) {
  return `
  <!DOCTYPE html>
  <html lang="en" style="height: 100%; width: 100%;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
      
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');
        
        .group-container { display: block; text-decoration: none; color: inherit; }
        .image-box { border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.15); }
        .image-box img { width: 100%; display: block; }
        .pill-button-wrapper { display: block; text-align: center; margin-top: 25px; }
        .glow-pill-button { display: inline-block; padding: 14px 32px; border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 50px; background-color: #111111; color: #ffffff !important; text-decoration: none !important; font-family: 'Inter', Arial, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; }

        @media only screen and (max-width: 600px) {
          .inner-container { padding: 20px 0 !important; }
          .mobile-stack { display: block !important; width: 100% !important; }
          .mobile-col { display: block !important; width: 100% !important; padding-right: 0 !important; }
          .left-col { text-align: center !important; margin-bottom: 25px !important; }
          .title-text { font-size: 60px !important; line-height: 0.9 !important; text-align: center !important; }
          .status-text { font-size: 22px !important; margin-top: 15px !important; text-align: center !important; }
          .divider-line { margin: 12px auto 0 auto !important; }
          .header-logo { height: 60px !important; }
          .header-gap { height: 20px !important; font-size: 20px !important; line-height: 20px !important; }
          .pill-button-wrapper { margin-top: 20px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; height: 100%; width: 100%; position: relative; -webkit-font-smoothing: antialiased;">
      <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="background-color: #000000; height: 100%; min-height: 100vh; border-collapse: collapse;">
        <tr>
          <td align="center" valign="middle" style="padding: 15px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="max-width: 800px; width: 100%; margin: 0 auto; border-collapse: collapse;">
              <tr>
                <td class="inner-container" style="padding: 15px 0 30px 0;"> 
                  <div style="text-align: center; width: 100%;">
                    <a href="${albumUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img class="header-logo" src="https://psocbitm.com/psoc-logo-white.png" alt="PSOC Logo" style="height: 85px; opacity: 0.95; display: inline-block; margin: 0 auto; border: none;" />
                    </a>
                  </div>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                    <tr><td class="header-gap" height="45" style="font-size: 45px; line-height: 45px; mso-line-height-rule: exactly;">&nbsp;</td></tr>
                  </table>
                  <table class="mobile-stack" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="border-collapse: collapse;">
                    <tr class="mobile-stack">
                      <td class="mobile-col left-col" width="55%" align="left" valign="middle" style="padding-right: 35px;">
                        <h1 class="title-text" style="font-family: 'Bebas Neue', Impact, Arial, sans-serif; font-size: 96px; line-height: 0.85; text-transform: uppercase; color: #ffffff; margin: 0; padding: 0; letter-spacing: 0px;">
                          ${albumTitle}
                        </h1>
                        <div class="status-text" style="font-family: 'Bebas Neue', Impact, Arial, sans-serif; font-size: 28px; font-weight: 400; text-transform: uppercase; color: #a3a3a3; letter-spacing: 1px; margin: 0; padding: 0; line-height: 1; margin-top: 30px;">
                          ALBUM IS LIVE
                        </div>
                        <div class="divider-line" style="border-top: 3px solid #a3a3a3; width: 45px; margin-top: 15px;"></div>
                      </td>
                      <td class="mobile-col" width="45%" align="right" valign="middle">
                        <a href="${albumUrl}" target="_blank" class="group-container" style="text-decoration: none;">
                          <div class="image-box">
                            <img src="${albumCoverUrl}" alt="${collectionName} Cover" />
                          </div>
                        </a>
                        <div class="pill-button-wrapper">
                          <a href="${albumUrl}" target="_blank" class="glow-pill-button" style="color: #ffffff !important; text-decoration: none !important;">
                            <span style="color: #ffffff !important;">View Album &nbsp;&#8250;</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export const getRenderedTemplate = (
  heading: string,
  components: EmailComponent[],
) => {
  const firstComponent = components[0];

  if (
    components.length === 1 &&
    firstComponent &&
    "content" in firstComponent &&
    firstComponent.content === "EDITORIAL_ALBUM_PAYLOAD"
  ) {
    const data = (firstComponent.options || {}) as any;
    return buildEditorialAlbumTemplate(
      data.albumTitle || "",
      data.albumCoverUrl || "",
      data.collectionName || "",
      data.year || "",
      data.status || "",
      data.albumUrl || "#"
    );
  }

  const content = buildTemplate(components);

  const emailBody = getTemplateLayout(
    [
      getTemplateLayout(
        [
          getTemplateLayout(heading, {
            align: "center",
            style: `
              font-family:'Cormorant Garamond', Georgia, serif;
              font-size:52px;
              font-weight:500;
              color:#ffffff;
              letter-spacing: -0.5px;
            `,
          }),
          content,
        ],
        {
          width: 700,
          style: `
            padding:60px;
            background:#080808;
            border-radius:8px;
            border:1px solid #1a1a1a;
          `,
        },
      ),
    ],
    {
      align: "center",
      style: `
        background:#000000;
        padding:80px;
        font-family:'Cormorant Garamond', Georgia, serif;
      `,
    },
  );

  return `
  <!DOCTYPE html>
  <html lang="en" style="height: 100%; width: 100%;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; height: 100%; width: 100%;">
      <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" style="height: 100%; min-height: 100vh;">
        <tr><td align="center" valign="middle">
          ${emailBody}
        </td></tr>
      </table>
    </body>
  </html>
  `;
};

// ============================================================================
// 2. VERIFICATION TEMPLATE (100% UNTOUCHED)
// ============================================================================

function getVerifyTemplateLayout(content: string | string[], props?: TemplateLayoutOptions) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
  style="max-width:${props?.width ? props.width + "px" : "100%"};margin:${props?.marginTop || "0"} auto ${props?.marginBottom || "20px"} auto;border-collapse:collapse;">
<tr><td align="${props?.align || "left"}" style="${props?.style || ""}">
${Array.isArray(content) ? content.join("") : content}
</td></tr></table>`;
}

function getVerifyComponentHTML(c: EmailComponent): string {
  switch (c.type) {
    case EmailComponentType.HEADING:
      return getVerifyTemplateLayout(`<h2 style="margin:0;color:#fff;font-size:30px;font-weight:700;">${c.content}</h2>`, c.options);
    case EmailComponentType.PARAGRAPH:
      return getVerifyTemplateLayout(`<p style="margin:0;color:#d1d5db;font-size:16px;line-height:28px;">${c.content.replaceAll("\n", "<br/>")}</p>`, c.options);
    case EmailComponentType.BUTTON:
      return getVerifyTemplateLayout(`<a href="${c.url}" style="background:#fff;color:#000;text-decoration:none;padding:16px 32px;border-radius:999px;display:inline-block;font-weight:700;">${c.content}</a>`,
        { align: "center", marginTop: "20px", marginBottom: "20px", ...c.options });
    case EmailComponentType.IMAGE:
      return getVerifyTemplateLayout(`<img src="${c.url}" width="${c.width}" style="display:block;border-radius:12px;width:${c.width}px;max-width:100%;height:auto;">`, c.options);
    case EmailComponentType.LIST:
      return getVerifyTemplateLayout("<ul style='color:#d1d5db;padding-left:20px;'>" + c.items.map(i => `<li style="margin-bottom:8px;">${i}</li>`).join("") + "</ul>", c.options);
    case EmailComponentType.GRID:
      return (c.components || []).map(getVerifyComponentHTML).join("");
    default:
      return "";
  }
}

export function getRenderedVerifyTemplate(
  heading: string,
  components: EmailComponent[]
) {
  const body = components.map(getVerifyComponentHTML).join("");
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{margin:0;background:#000;font-family:Helvetica,Arial,sans-serif;}
.card{max-width:680px;margin:40px auto;background:#111;border:1px solid #2b2b2b;border-radius:24px;padding:40px;}
.logo{font-size:28px;color:#fff;font-weight:800;text-align:center}
.sub{color:#9ca3af;text-align:center;margin-top:6px;margin-bottom:32px}
.footer{color:#777;text-align:center;font-size:13px;padding:24px}
@media(max-width:600px){
.card{margin:16px;padding:24px;border-radius:18px}
.logo{font-size:24px}
h2{font-size:26px!important}
p{font-size:15px!important;line-height:24px!important}
a{display:block!important}
}
</style>
</head>
<body>
<div class="card">
<div style="text-align:center;margin-bottom:30px;">
    <img
        src="/psoc-logo-white.png"
        alt="PSOC Logo"
        width="120"
        style="display:block;margin:0 auto 15px auto;"
    />
    <div
    style="
        color:rgba(255,255,255,.35);
        font-size:12px;
        font-family:Inter, Arial, Helvetica, sans-serif;
        text-transform:uppercase;
        letter-spacing:0.55em;
        font-weight:500;
        text-align:center;
        margin-top:16px;
        margin-bottom:36px;
    "
    >
    PHOTOGRAPHIC SOCIETY • BIT MESRA
</div>
</div>
${getVerifyTemplateLayout(`<h1 style="color:#fff;text-align:center;font-size:38px;margin:0 0 28px;">${heading}</h1>`)}
${body}
<hr style="border:none;border-top:1px solid #2b2b2b;margin:32px 0;">
<p style="text-align:center;color:#9ca3af;font-style:italic;">Capture Moments. Create Stories.</p>
</div>
<div class="footer">© ${new Date().getFullYear()} Photographic Society, BIT Mesra</div>
</body>
</html>`;
}

// ============================================================================
// 3. THE RAW CONCATENATION MERGE
// ============================================================================

export const getGluedEmailTemplate = (
  albumHeading: string,
  albumComponents: EmailComponent[],
  verifyHeading: string,
  verifyComponents: EmailComponent[]
) => {
  // Generates the fully intact Album HTML string
  const rawAlbumHtml = getRenderedTemplate(albumHeading, albumComponents);
  
  // Generates the fully intact Verify HTML string
  const rawVerifyHtml = getRenderedVerifyTemplate(verifyHeading, verifyComponents);

  // Directly joins them without changing any inner tags or structure
  return `${rawAlbumHtml} \n\n ${rawVerifyHtml}`;
};