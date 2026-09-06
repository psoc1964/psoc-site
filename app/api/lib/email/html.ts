import {
  EmailComponent,
  EmailComponentType,
  TemplateLayoutOptions,
} from "@backend/lib/email/types";

// ============================================================================
// 1. COMMON LAYOUT FOR STANDARD COMPONENTS
// ============================================================================

function getTemplateLayout(
  content: string[] | string,
  props?: TemplateLayoutOptions,
) {
  return `<table
    width="100%"
    border="0"
    cellspacing="0"
    cellpadding="0"
    role="presentation"
    style="
      border-spacing:0;
      border-collapse:collapse;
      max-width:${props?.width ? props.width + "px" : "100%"};
      margin-bottom:${props?.marginBottom || "1rem"};
      margin-top:${props?.marginTop || "1rem"};
    "
  >
    <tr>
      <td
        style="${props?.style || ""}"
        align="${props?.align || "left"}"
      >
        ${typeof content === "string" ? content : content.join("")}
      </td>
    </tr>
  </table>`;
}

// ============================================================================
// 2. STANDARD COMPONENT RENDERER
//    Used by VerifyEmail, ResetPassword, etc.
// ============================================================================

function getComponentHTML(component: EmailComponent): string {
  switch (component.type) {
    case EmailComponentType.LIST:
      return getTemplateLayout(
        `<ul style="margin:0;padding-left:16px;">
          ${component.items
          .map(
            (item) =>
              `<li style="
                  margin-bottom:8px;
                  font-size:16px;
                  color:#d1d5db;
                ">${item}</li>`,
          )
          .join("")}
        </ul>`,
        component.options,
      );

    case EmailComponentType.IMAGE:
      return getTemplateLayout(
        `<img
          alt=""
          src="${component.url}"
          style="
            margin:0;
            border:none;
            max-width:100%;
            height:auto;
            display:block;
            border-radius:8px;
            width:${component.width}px;
          "
          width="${component.width}"
        />`,
        component.options,
      );

    case EmailComponentType.GRID:
      return buildTemplate(component.components);

    case EmailComponentType.BUTTON:
      return getTemplateLayout(
        `<a
          href="${component.url}"
          target="_blank"
          style="
            display:inline-block;
            background-color:#ffffff;
            color:#000000;
            padding:12px 20px;
            border-radius:8px;
            text-decoration:none;
            font-size:16px;
            line-height:20px;
            border:0;
          "
        >
          ${component.content}
        </a>`,
        {
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
          ...component.options,
        },
      );

    case EmailComponentType.HEADING:
      return getTemplateLayout(
        `<h2 style="
          font-size:24px;
          line-height:32px;
          color:#ffffff;
          font-weight:600;
          margin:0;
        ">
          ${component.content}
        </h2>`,
        {
          marginTop: "1.5rem",
          ...component.options,
        },
      );

    case EmailComponentType.PARAGRAPH:
      return getTemplateLayout(
        `<p style="
          font-size:16px;
          color:#ffffff;
          margin:0;
          line-height:24px;
        ">
          ${component.content.replaceAll("\n", "<br/>")}
        </p>`,
        component.options,
      );

    default:
      return "";
  }
}

function buildTemplate(components: EmailComponent[]) {
  return getTemplateLayout(
    components.map((component) => getComponentHTML(component)).join(""),
  );
}

// ============================================================================
// 3. ALBUM RELEASE TEMPLATE
// ============================================================================

export function resolvePublicImageUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();

  // If it's already a direct Google thumbnail or lh3 CDN URL
  if (
    trimmed.includes("drive.google.com/thumbnail") ||
    trimmed.includes("lh3.googleusercontent.com")
  ) {
    return trimmed;
  }

  // Extract Drive File ID from /api/drive-image?id=XYZ or ?id=XYZ or &id=XYZ
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${idParamMatch[1]}&sz=w1000`;
  }

  // Extract Drive File ID from /file/d/XYZ or /d/XYZ
  const fileMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1000`;
  }

  // If it's a standalone Drive ID (e.g. 1XjqW6uZsqCJE_rPjshdxwJNEYTrKkG4)
  if (/^[a-zA-Z0-9_-]{25,55}$/.test(trimmed)) {
    return `https://drive.google.com/thumbnail?id=${trimmed}&sz=w1000`;
  }

  // If it's already an absolute URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Fallback for relative paths with domain
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://psocbitm.com";
  return `${baseUrl}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

function buildEditorialAlbumTemplate(
  albumTitle: string,
  albumCoverUrl: string,
  collectionName: string,
  year: string,
  status: string,
  albumUrl: string,
) {
  const resolvedCoverUrl = resolvePublicImageUrl(albumCoverUrl);

  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      background: #ffffff;
    }

    body {
      font-family: Inter, Arial, Helvetica, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* ── MAIN EMAIL CARD (DESKTOP) ── */
    .email-card {
      width: 100%;
      max-width: 980px;
      margin: 30px auto;
      background: #000000;
      border: 1px solid #222222;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
    }

    .logo-wrapper {
      text-align: center;
      padding: 36px 30px 12px;
    }

    .logo {
      width: 76px;
      height: auto;
      display: block;
      margin: 0 auto;
      border: 0;
    }

    .content-table {
      width: 100%;
      border-collapse: collapse;
    }

    .title-column {
      width: 46%;
      padding: 30px 20px 45px 52px;
      vertical-align: middle;
      text-align: left;
    }

    .image-column {
      width: 54%;
      padding: 20px 52px 45px 20px;
      vertical-align: middle;
      text-align: center;
    }

    .album-title {
      font-family: 'Bebas Neue', 'Anton', 'Oswald', sans-serif-condensed, Impact, 'Arial Black', sans-serif;
      font-size: 80px;
      line-height: 0.90;
      font-weight: 800;
      text-transform: uppercase;
      color: #ffffff;
      letter-spacing: 0.5px;
      margin: 0;
      padding: 0;
    }

    .album-status {
      font-family: Inter, Arial, Helvetica, sans-serif;
      font-size: 14px;
      line-height: 1;
      font-weight: 600;
      text-transform: uppercase;
      color: #8e8e93;
      letter-spacing: 2.5px;
      margin-top: 24px;
    }

    .status-line {
      width: 38px;
      height: 2px;
      background-color: #555558;
      margin-top: 14px;
      border-radius: 2px;
    }

    .image-link {
      display: block;
      text-decoration: none;
      border: 0;
    }

    .image-box {
      width: 100%;
      overflow: hidden;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background-color: #0c0c0e;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
    }

    .album-cover {
      width: 100%;
      height: auto;
      display: block;
      border: 0;
      border-radius: 15px;
    }

    .button-wrapper {
      text-align: center;
      padding-top: 22px;
    }

    .album-button {
      display: inline-block;
      padding: 11px 28px;
      border: 1px solid rgba(255, 255, 255, 0.38);
      border-radius: 9999px;
      background: #000000;
      background-color: #000000;
      color: #ffffff !important;
      text-decoration: none !important;
      font-family: Inter, Arial, Helvetica, sans-serif;
      font-size: 13px;
      line-height: 20px;
      font-weight: 500;
      letter-spacing: 0.3px;
      transition: box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease, transform 0.25s ease;
    }

    /* ── HOVER GLOW EFFECT ── */
    .album-button:hover {
      background: #111111 !important;
      background-color: #111111 !important;
      border-color: #ffffff !important;
      color: #ffffff !important;
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.85),
                  0 0 20px rgba(255, 255, 255, 0.55),
                  0 0 36px rgba(255, 255, 255, 0.30) !important;
      transform: translateY(-1px);
    }

    /* ── MOBILE / PHONE STYLING (MATCHES DESKTOP CONDENSED BOLD STYLE) ── */
    @media only screen and (max-width: 680px) {
      .email-card {
        width: calc(100% - 20px) !important;
        margin: 12px auto !important;
        border-radius: 20px !important;
        padding: 32px 18px 36px 18px !important;
        background: #000000 !important;
        text-align: center !important;
      }

      .logo-wrapper {
        padding: 0 0 22px 0 !important;
      }

      .logo {
        width: 68px !important;
      }

      .content-table,
      .content-table tbody,
      .content-table tr,
      .title-column,
      .image-column {
        display: block !important;
        width: 100% !important;
        padding: 0 !important;
      }

      .title-column {
        text-align: center !important;
        padding: 0 10px !important;
      }

      .album-title {
        font-family: 'Bebas Neue', 'Anton', 'Oswald', sans-serif-condensed, Impact, 'Arial Black', sans-serif !important;
        font-size: 52px !important;
        line-height: 0.92 !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        color: #ffffff !important;
        letter-spacing: 0.5px !important;
        text-align: center !important;
        margin: 0 auto !important;
        padding: 0 !important;
        display: block !important;
      }

      .album-status {
        font-family: Inter, Arial, Helvetica, sans-serif !important;
        font-size: 13px !important;
        line-height: 1.2 !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        color: #8e8e93 !important;
        letter-spacing: 2.5px !important;
        margin-top: 14px !important;
        text-align: center !important;
      }

      .status-line {
        width: 36px !important;
        height: 2px !important;
        background-color: #555558 !important;
        margin: 12px auto 0 auto !important;
        border-radius: 2px !important;
      }

      .image-column {
        padding-top: 28px !important;
      }

      .image-box {
        max-width: 100% !important;
        border-radius: 16px !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        margin: 0 auto !important;
      }

      .album-cover {
        border-radius: 15px !important;
      }

      .button-wrapper {
        padding-top: 24px !important;
      }

      .album-button {
        display: inline-block !important;
        padding: 12px 28px !important;
        font-size: 13px !important;
        border: 1px solid rgba(255, 255, 255, 0.35) !important;
        background-color: #000000 !important;
      }
    }

    @media only screen and (max-width: 440px) {
      .album-title {
        font-size: 46px !important;
        line-height: 0.92 !important;
      }
      .album-status {
        font-size: 12px !important;
        letter-spacing: 2px !important;
      }
    }

    @media only screen and (max-width: 360px) {
      .album-title {
        font-size: 40px !important;
        line-height: 0.92 !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="border-collapse:collapse; background:#ffffff;">
    <tr>
      <td align="center" style="padding:20px 12px;">
        
        <table class="email-card" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="max-width:980px; background:#000000; border-radius:28px; overflow:hidden;">
          
          <!-- TOP LOGO -->
          <tr>
            <td class="logo-wrapper" align="center" colspan="2" style="padding:36px 30px 12px; text-align:center;">
              <a href="${albumUrl}" target="_blank" style="text-decoration:none; display:inline-block;">
                <img class="logo" src="https://psocbitm.com/psoc-logo-white.png" alt="Photographic Society" width="76" style="width:76px; height:auto; display:block; margin:0 auto; border:0;" />
              </a>
            </td>
          </tr>

          <!-- MAIN CONTENT (2-COLUMN ON DESKTOP, CENTERED STACKED ON MOBILE) -->
          <tr>
            <td colspan="2">
              <table class="content-table" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tr>
                  
                  <!-- LEFT COLUMN: TITLE, STATUS, LINE -->
                  <td class="title-column" width="46%" valign="middle" style="padding:30px 20px 45px 52px; vertical-align:middle; text-align:left;">
                    <h1 class="album-title" style="font-family:'Bebas Neue', 'Anton', 'Oswald', sans-serif-condensed, Impact, 'Arial Black', sans-serif; font-size:80px; line-height:0.90; font-weight:800; text-transform:uppercase; color:#ffffff; letter-spacing:0.5px; margin:0; padding:0;">
                      ${albumTitle}
                    </h1>

                    <div class="album-status" style="font-family:Inter, Arial, Helvetica, sans-serif; font-size:14px; line-height:1; font-weight:600; text-transform:uppercase; color:#8e8e93; letter-spacing:2.5px; margin-top:24px;">
                      ${status || "ALBUM IS LIVE"}
                    </div>

                    <div class="status-line" style="width:38px; height:2px; background-color:#555558; margin-top:14px; border-radius:2px;"></div>
                  </td>

                  <!-- RIGHT COLUMN: COVER IMAGE & CENTERED BUTTON -->
                  <td class="image-column" width="54%" valign="middle" align="center" style="padding:20px 52px 45px 20px; vertical-align:middle; text-align:center;">
                    <a href="${albumUrl}" target="_blank" class="image-link" style="display:block; text-decoration:none; border:0;">
                      <div class="image-box" style="width:100%; overflow:hidden; border-radius:16px; border:1px solid rgba(255,255,255,0.14); background-color:#0c0c0e; box-shadow:0 12px 36px rgba(0,0,0,0.6);">
                        <img class="album-cover" src="${resolvedCoverUrl}" alt="${collectionName} Cover" width="100%" style="width:100%; height:auto; display:block; border:0; border-radius:15px;" />
                      </div>
                    </a>

                    <!-- ACTION BUTTON (CENTERED UNDER IMAGE) -->
                    <div class="button-wrapper" style="text-align:center; padding-top:22px;">
                      <a href="${albumUrl}" target="_blank" class="album-button" style="display:inline-block; padding:11px 28px; border:1px solid rgba(255,255,255,0.38); border-radius:9999px; background:#000000; background-color:#000000; color:#ffffff !important; text-decoration:none !important; font-family:Inter, Arial, Helvetica, sans-serif; font-size:13px; line-height:20px; font-weight:500; letter-spacing:0.3px;">
                        View Album <span style="padding-left:6px; font-size:14px; line-height:1;">›</span>
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

// ============================================================================
// 4. VERIFY / STANDARD EMAIL TEMPLATE
// ============================================================================

function getVerifyTemplateLayout(
  content: string | string[],
  props?: TemplateLayoutOptions,
) {
  return `<table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
      max-width:${props?.width ? props.width + "px" : "100%"};
      margin:${props?.marginTop || "0"} auto ${props?.marginBottom || "20px"} auto;
      border-collapse:collapse;
    "
  >

    <tr>

      <td
        align="${props?.align || "left"}"
        style="${props?.style || ""}"
      >

        ${Array.isArray(content) ? content.join("") : content}

      </td>

    </tr>

  </table>`;
}

function getVerifyComponentHTML(component: EmailComponent): string {
  switch (component.type) {
    case EmailComponentType.HEADING:
      return getVerifyTemplateLayout(
        `<h2 style="
          margin:0;
          color:#ffffff;
          font-size:30px;
          font-weight:700;
        ">
          ${component.content}
        </h2>`,
        component.options,
      );

    case EmailComponentType.PARAGRAPH:
      return getVerifyTemplateLayout(
        `<p style="
          margin:0;
          color:#d1d5db;
          font-size:16px;
          line-height:28px;
          font-family:Helvetica,Arial,sans-serif;
        ">
          ${component.content.replaceAll("\n", "<br/>")}
        </p>`,
        component.options,
      );

    case EmailComponentType.BUTTON:
      return getVerifyTemplateLayout(
        `
    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="border-collapse:collapse;"
    >
      <tr>
        <td
          align="center"
          style="padding:20px 0;"
        >

          <a
            href="${component.url}"
            target="_blank"
            style="
              display:inline-block !important;
              background-color:#ffffff !important;
              color:#000000 !important;
              -webkit-text-fill-color:#000000 !important;
              text-decoration:none !important;
              padding:16px 32px;
              border-radius:999px;
              font-family:Arial,Helvetica,sans-serif;
              font-size:16px;
              font-weight:700;
              line-height:20px;
              text-align:center;
              border:0;
            "
          >
            <span
              style="
                color:#000000 !important;
                -webkit-text-fill-color:#000000 !important;
                background-color:#ffffff !important;
                font-family:Arial,Helvetica,sans-serif;
                font-size:16px;
                font-weight:700;
              "
            >
              ${component.content}
            </span>
          </a>

        </td>
      </tr>
    </table>
    `,
        {
          align: "center",
          marginTop: "20px",
          marginBottom: "20px",
          ...component.options,
        },
      );

    case EmailComponentType.IMAGE:
      return getVerifyTemplateLayout(
        `<img
          src="${component.url}"
          width="${component.width}"
          style="
            display:block;
            border-radius:12px;
            width:${component.width}px;
            max-width:100%;
            height:auto;
          "
        />`,
        component.options,
      );

    case EmailComponentType.LIST:
      return getVerifyTemplateLayout(
        `
        <ul
          style="
            color:#d1d5db;
            padding-left:20px;
            margin:0;
          "
        >
          ${component.items
          .map(
            (item) =>
              `<li style="margin-bottom:8px;">
                  ${item}
                </li>`,
          )
          .join("")}
        </ul>
        `,
        component.options,
      );

    case EmailComponentType.GRID:
      return component.components
        .map((childComponent) => getVerifyComponentHTML(childComponent))
        .join("");

    default:
      return "";
  }
}

// ============================================================================
// 5. VERIFY HTML
// ============================================================================

export function getRenderedVerifyTemplate(
  heading: string,
  components: EmailComponent[],
) {

  const body = components
    .map(getVerifyComponentHTML)
    .join("");

  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<style>

body {
  margin:0;
  background:#000;
  font-family:Helvetica,Arial,sans-serif;
}

.card {
  max-width:680px;
  margin:40px auto;
  background:#111;
  border:1px solid #2b2b2b;
  border-radius:24px;
  padding:40px;
}

.footer {
  color:#777;
  text-align:center;
  font-size:13px;
  padding:24px;
}

@media(max-width:600px) {
  .psoc-subtitle {
  font-size:10px !important;
  letter-spacing:0.28em !important;
  white-space:nowrap !important;
  }

  .card {
    width:calc(100% - 30px);
    margin:15px auto;
    padding:40px 24px 28px 24px;
    border-radius:20px;
  }

  h1 {
    font-size:34px !important;
    line-height:42px !important;
    margin-bottom:35px !important;
  }

  h2 {
    font-size:26px !important;
  }

  p {
    font-size:15px !important;
    line-height:24px !important;
  }


}

</style>

</head>

<body>

<div class="card">

  <div
    style="
      text-align:center;
      margin-bottom:30px;
    "
  >

    <img
      src="https://psocbitm.com/psoc-logo-white.png"
      alt="PSOC Logo"
      width="120"
      style="
        display:block;
        margin:0 auto 15px auto;
      "
    />

    <div
      class="psoc-subtitle"
      style="
        color:rgba(255,255,255,.35);
        font-size:12px;
        font-family:Inter,Arial,Helvetica,sans-serif;
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

  ${getVerifyTemplateLayout(
    `<h1 style="
      color:#fff;
      text-align:center;
      font-size:38px;
      margin:0 0 28px;
    ">
      ${heading}
    </h1>`,
  )}

  ${body}

  <hr
    style="
      border:none;
      border-top:1px solid #2b2b2b;
      margin:32px 0;
    "
  >

  <p
    style="
      text-align:center;
      color:#9ca3af;
      font-style:italic;
    "
  >
    Capture Moments. Create Stories.
  </p>

</div>

<div class="footer">

  © ${new Date().getFullYear()}
  Photographic Society, BIT Mesra

</div>

</body>

</html>
`;
}

// ============================================================================
// 6. MAIN FUNCTION
// ============================================================================
//
// IMPORTANT:
//
// send-template.ts calls:
//
// getRenderedTemplate(title, components)
//
// It does NOT pass "template".
//
// Therefore we detect the Album Release template using
// EDITORIAL_ALBUM_PAYLOAD.
//
// ============================================================================

export const getRenderedTemplate = (
  heading: string,
  components: EmailComponent[],
  template?: string,
) => {

  const firstComponent = components[0];

  // --------------------------------------------------------------------------
  // ALBUM RELEASE
  // --------------------------------------------------------------------------

  if (
    components.length === 1 &&
    firstComponent &&
    firstComponent.type === EmailComponentType.PARAGRAPH &&
    firstComponent.content === "EDITORIAL_ALBUM_PAYLOAD"
  ) {

    const data = (firstComponent.options || {}) as {
      albumTitle?: string;
      albumCoverUrl?: string;
      collectionName?: string;
      year?: string;
      status?: string;
      albumUrl?: string;
    };

    return buildEditorialAlbumTemplate(
      data.albumTitle || "",
      data.albumCoverUrl || "",
      data.collectionName || "",
      data.year || "",
      data.status || "ALBUM IS LIVE",
      data.albumUrl || "#",
    );
  }

  // --------------------------------------------------------------------------
  // VERIFY / OTHER STANDARD EMAILS
  // --------------------------------------------------------------------------

  return getRenderedVerifyTemplate(
    heading,
    components,
  );
};

// ============================================================================
// 7. BACKWARD COMPATIBILITY
// ============================================================================

export const getRenderedVerifyTemplateHTML = getRenderedVerifyTemplate;