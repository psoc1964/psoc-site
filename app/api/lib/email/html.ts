import {
  EmailComponent,
  EmailComponentType,
  TemplateLayoutOptions,
} from "@backend/lib/email/types";

// ============================================================================
// HELPER LAYOUT FUNCTIONS
// ============================================================================

function wrapStandard(content: string | string[], props?: TemplateLayoutOptions) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
  style="max-width:${props?.width ? props.width + "px" : "100%"};margin:${props?.marginTop || "0"} auto ${props?.marginBottom || "20px"} auto;border-collapse:collapse;">
<tr><td align="${props?.align || "left"}" style="${props?.style || ""}">
${Array.isArray(content) ? content.join("") : content}
</td></tr></table>`;
}

function renderStandardComponent(c: EmailComponent): string {
  switch (c.type) {
    case EmailComponentType.HEADING:
      return wrapStandard(`<h2 style="margin:0;color:#fff;font-size:30px;font-weight:700;">${c.content}</h2>`, c.options);
    case EmailComponentType.PARAGRAPH:
      return wrapStandard(`<p style="margin:0;color:#d1d5db;font-size:16px;line-height:28px;">${c.content.replaceAll("\n", "<br/>")}</p>`, c.options);
    case EmailComponentType.BUTTON:
      return wrapStandard(`<a href="${c.url}" style="background:#fff;color:#000;text-decoration:none;padding:16px 32px;border-radius:999px;display:inline-block;font-weight:700;">${c.content}</a>`,
        { align: "center", marginTop: "20px", marginBottom: "20px", ...c.options });
    case EmailComponentType.IMAGE:
      return wrapStandard(`<img src="${c.url}" width="${c.width}" style="display:block;border-radius:12px;width:${c.width}px;max-width:100%;height:auto;">`, c.options);
    case EmailComponentType.LIST:
      return wrapStandard("<ul style='color:#d1d5db;padding-left:20px;'>" + c.items.map(i => `<li style="margin-bottom:8px;">${i}</li>`).join("") + "</ul>", c.options);
    case EmailComponentType.GRID:
      return (c.components || []).map(renderStandardComponent).join("");
    default:
      return "";
  }
}

// ============================================================================
// EDITORIAL ALBUM TEMPLATE
// ============================================================================

function buildEditorialAlbumTemplate(
  albumTitle: string,
  albumCoverUrl: string,
  collectionName: string,
  year: string,
  status: string,
  albumUrl: string
) {
  return `<!DOCTYPE html>
<html lang="en" style="height: 100%; width: 100%;">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');
      
      .group-container {
        position: relative;
        display: block;
        text-decoration: none;
        color: inherit;
      }

      .deep-glow {
        position: absolute;
        top: -24px; left: -24px; right: -24px; bottom: -24px;
        border-radius: 44px;
        background-color: rgba(0, 195, 255, 0.35); 
        filter: blur(45px);
        opacity: 0;
        transition: opacity 0.7s ease;
        pointer-events: none;
      }
      .group-container:hover .deep-glow { opacity: 0.7; }

      .base-glow {
        position: absolute;
        top: -8px; left: -8px; right: -8px; bottom: -8px;
        border-radius: 32px;
        background-color: rgba(0, 195, 255, 0.15);
        filter: blur(20px);
        opacity: 0.4; 
        transition: opacity 0.5s ease;
        pointer-events: none;
      }
      .group-container:hover .base-glow { opacity: 0.65; }

      .image-box {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 0 20px rgba(0, 195, 255, 0.15), 0 15px 35px rgba(0, 0, 0, 0.5);
        z-index: 5;
      }

      .image-box img {
        width: 100%;
        display: block;
        transition: transform 1s ease-out;
      }
      .group-container:hover .image-box img {
        transform: scale(1.04);
      }

      .event-highlight {
        position: absolute;
        bottom: 24px;
        left: 24px;
        color: #ffffff;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 11px;
        letter-spacing: 2.5px;
        font-weight: 600;
        z-index: 20;
        text-shadow: 0 2px 8px rgba(0,0,0,0.8);
      }
      .beam-dot {
        display: inline-block;
        vertical-align: middle;
        width: 7px;
        height: 7px;
        background-color: #00c3ff;
        border-radius: 50%;
        margin-right: 12px;
        margin-top: -2px;
        box-shadow: 0 0 6px 1px rgba(0, 195, 255, 0.6);
      }

      .hover-arrow {
        position: absolute;
        bottom: 15px;
        right: 24px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1.5px solid rgba(255, 255, 255, 0.8);
        background-color: transparent; 
        color: #ffffff;
        font-size: 16px;
        line-height: 41px;
        text-align: center;
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 20;
      }
      .group-container:hover .hover-arrow {
        opacity: 1;
        transform: translateX(0);
      }

      .pill-button-wrapper {
        display: block;
        text-align: center;
        margin-top: 24px;
      }
      .glow-pill-button {
        display: inline-block;
        padding: 10px 26px;
        border: 1.5px solid rgba(255, 255, 255, 0.35);
        border-radius: 50px;
        background-color: #080808;
        color: #ffffff;
        text-decoration: none;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 15px;
        font-weight: 500;
        letter-spacing: 0.5px;
        transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
        box-shadow: none;
      }

      .glow-pill-button:hover {
        border-color: #ffffff;
        box-shadow: 0 0 12px rgba(255, 255, 255, 0.45), 0 0 22px rgba(255, 255, 255, 0.2), inset 0 0 6px rgba(255, 255, 255, 0.15);
        color: #ffffff;
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        transform: translateY(-1px);
      }

      .arrow-single {
        display: inline-block;
        transition: opacity 0.3s ease;
        font-size: 1.15em;
        vertical-align: -1px;
      }
      .arrow-triple {
        display: none;
        font-size: 1.15em;
        vertical-align: -1px;
      }
      .glow-pill-button:hover .arrow-single {
        display: none;
      }
      .glow-pill-button:hover .arrow-triple {
        display: inline-block;
      }

      @media only screen and (max-width: 1024px) {
        .title-text { font-size: 90px !important; }
        .status-text { font-size: 30px !important; margin-top: 35px !important; }
        .header-gap { height: 40px !important; font-size: 40px !important; line-height: 40px !important; }
      }

      @media only screen and (max-width: 768px) {
        .inner-container { padding: 20px 0 !important; }
        .mobile-stack {
          display: block !important;
          width: 100% !important;
        }
        .mobile-col {
          display: block !important;
          width: 100% !important;
          padding-right: 0 !important;
        }
        .left-col {
          text-align: center !important;
          margin-bottom: 35px !important;
        }
        .title-text { 
          font-size: 70px !important; 
          line-height: 0.9 !important;
          text-align: center !important;
        }
        .status-text { 
          font-size: 26px !important; 
          margin-top: 15px !important; 
          text-align: center !important;
        }
        .divider-line { 
          margin: 12px auto 0 auto !important; 
        }
        .header-logo { 
          height: 80px !important; 
        }
        .header-gap { 
          height: 30px !important; 
          font-size: 30px !important; 
          line-height: 30px !important; 
        }
        .event-highlight { bottom: 15px !important; left: 15px !important; font-size: 9px !important; }
        .hover-arrow { width: 34px !important; height: 34px !important; line-height: 31px !important; bottom: 8px !important; right: 15px !important; }
        .pill-button-wrapper {
          margin-top: 22px !important;
        }
        .glow-pill-button {
          font-size: 14px !important;
          padding: 9px 22px !important;
        }
      }

      @media only screen and (max-width: 500px) {
        .title-text { font-size: 52px !important; }
        .status-text { font-size: 22px !important; }
        .header-logo { height: 65px !important; }
        .header-gap { height: 20px !important; font-size: 20px !important; line-height: 20px !important; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #000000; height: 100%; width: 100%; position: relative; -webkit-font-smoothing: antialiased;">

    <!-- MAIN WRAPPER -->
    <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="background-color: #000000; height: 100%; min-height: 100vh; border-collapse: collapse;">
      <tr>
        <td align="center" valign="middle" style="padding: 15px;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="max-width: 1240px; width: 100%; margin: 0 auto; border-collapse: collapse;">
            <tr>
              <td class="inner-container" style="padding: 15px 0 30px 0;"> 

                <!-- LOGO -->
                <div style="text-align: center; width: 100%;">
                  <a href="${albumUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                    <img class="header-logo" src="https://psocbitm.com/psoc-logo-white.png" alt="PSOC Logo" style="height: 125px; opacity: 0.95; display: inline-block; margin: 0 auto; border: none;" />
                  </a>
                </div>

                <!-- SPACING -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr><td class="header-gap" height="35" style="font-size: 35px; line-height: 35px; mso-line-height-rule: exactly;">&nbsp;</td></tr>
                </table>

                <!-- HERO -->
                <table class="mobile-stack" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="border-collapse: collapse;">
                  <tr class="mobile-stack">
                    
                    <!-- LEFT COLUMN -->
                    <td class="mobile-col left-col" width="42%" align="left" valign="middle" style="padding-right: 35px;">
                      <h1 class="title-text" style="font-family: 'Bebas Neue', Impact, Arial, sans-serif; font-size: 129px; line-height: 0.85; text-transform: uppercase; color: #ffffff; margin: 0; padding: 0; letter-spacing: 0px;">
                        ${albumTitle}
                      </h1>
                      
                      <div class="status-text" style="font-family: 'Bebas Neue', Impact, Arial, sans-serif; font-size: 40px; font-weight: 400; text-transform: uppercase; color: #a3a3a3; letter-spacing: 1px; margin: 0; padding: 0; line-height: 1; margin-top: 45px;">
                        ${status || "ALBUM IS LIVE"}
                      </div>
                      <div class="divider-line" style="border-top: 3px solid #a3a3a3; width: 45px; margin-top: 15px;"></div>
                    </td>

                    <!-- RIGHT COLUMN -->
                    <td class="mobile-col" width="58%" align="right" valign="middle">
                      <a href="${albumUrl}" target="_blank" class="group-container">
                        <div class="deep-glow"></div>
                        <div class="base-glow"></div>
                        <div class="image-box">
                          <img src="${albumCoverUrl}" alt="${collectionName} Cover" />
                          <div class="event-highlight">
                            <span class="beam-dot"></span><span style="display: inline-block; vertical-align: middle;">${collectionName || "ANNUAL EVENT"}</span>
                          </div>
                          <div class="hover-arrow">&#10095;</div>
                        </div>
                      </a>

                      <div class="pill-button-wrapper">
                        <a href="${albumUrl}" target="_blank" class="glow-pill-button">
                          <span>View Album</span>
                          <span class="arrow-single">&nbsp;&#8250;</span>
                          <span class="arrow-triple">&nbsp;&#8250;</span>
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
</html>`;
}

// ============================================================================
// MAIN EXPORTED RENDER FUNCTION
// ============================================================================

export function getRenderedTemplate(
  heading: string,
  components: EmailComponent[]
): string {
  const firstComponent = components[0];

  // 1. Branch: Special Album Release Layout
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

  // 2. Branch: Standard Template (Verification & General Emails)
  const body = components.map(renderStandardComponent).join("");

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
        src="https://psocbitm.com/psoc-logo-white.png"
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
${wrapStandard(`<h1 style="color:#fff;text-align:center;font-size:38px;margin:0 0 28px;">${heading}</h1>`)}
${body}
<hr style="border:none;border-top:1px solid #2b2b2b;margin:32px 0;">
<p style="text-align:center;color:#9ca3af;font-style:italic;">Capture Moments. Create Stories.</p>
</div>
<div class="footer">© ${new Date().getFullYear()} Photographic Society, BIT Mesra</div>
</body>
</html>`;
}

// Backwards compatibility alias if getRenderedVerifyTemplate is explicitly imported elsewhere
export const getRenderedVerifyTemplate = getRenderedTemplate;

