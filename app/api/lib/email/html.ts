import {
  EmailComponent,
  EmailComponentType,
  TemplateLayoutOptions,
} from "@backend/lib/email/types";
import { Resend } from "resend";

// Safe Resend initialization: prevents Next.js/Vercel build crashes if the env var is missing during static analysis
const resend = new Resend(
  process.env.RESEND_API_KEY || "re_dummy_key_for_build"
);

function getTemplateLayout(
  content: string[] | string,
  props?: TemplateLayoutOptions,
) {
  return `
  <table
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
        align="${props?.align || "left"}"
        style="${props?.style || ""}"
      >
        ${typeof content === "string" ? content : content.join("")}
      </td>
    </tr>
  </table>
  `;
}

function getComponentHTML(component: EmailComponent): string {
  switch (component.type) {
    case EmailComponentType.LIST:
      return getTemplateLayout(
        `
        <ul style="padding-left:20px; margin: 0;">
          ${(component.items || [])
            .map(
              (item) =>
                `<li style="color:#d1d5db;font-size:20px;margin-bottom:12px;font-family:'Cormorant Garamond', Georgia, serif;">${item}</li>`
            )
            .join("")}
        </ul>
        `,
        component.options
      );

    case EmailComponentType.IMAGE:
      return getTemplateLayout(
        `
        <img
          src="${component.url || ""}"
          width="${component.width || ""}"
          style="
            width:${component.width ? component.width + "px" : "auto"};
            border-radius:4px;
            display:block;
            border:none;
          "
        />
        `,
        component.options
      );

    case EmailComponentType.GRID:
      return buildTemplate(component.components || []);

    case EmailComponentType.BUTTON:
      return getTemplateLayout(
        `
        <a
          href="${component.url || "#"}"
          target="_blank"
          style="
            display:inline-block;
            background-color:transparent;
            color:#ffffff;
            padding:14px 40px;
            font-size:12px;
            border-radius:2px;
            text-decoration:none;
            font-weight:400;
            letter-spacing:2px;
            text-transform:uppercase;
            border:1px solid #ffffff;
            font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          "
        >
          ${component.content || ""}
        </a>
        `,
        component.options
      );

    case EmailComponentType.HEADING:
      return getTemplateLayout(
        `
        <h2
          style="
            margin:0;
            font-size:40px;
            color:#ffffff;
            font-weight:500;
            letter-spacing:0px;
            font-family:'Cormorant Garamond', Georgia, serif;
          "
        >
          ${component.content || ""}
        </h2>
        `,
        component.options
      );

    case EmailComponentType.PARAGRAPH:
      return getTemplateLayout(
        `
        <p
          style="
            color:#a3a3a3;
            font-size:20px;
            line-height:30px;
            margin:0;
            font-weight: 400;
            font-family:'Cormorant Garamond', Georgia, serif;
          "
        >
          ${(component.content || "").replaceAll("\n", "<br/>")}
        </p>
        `,
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
            
            <!-- INNER LAYOUT CONTAINER (Scaled to 1240px for full canvas coverage) -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="max-width: 1240px; width: 100%; margin: 0 auto; border-collapse: collapse;">
              <tr>
                <td class="inner-container" style="padding: 15px 0 30px 0;"> 

                  <!-- 1. LOGO AT TOP CENTER -->
                  <div style="text-align: center; width: 100%;">
                    <a href="${albumUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img class="header-logo" src="/psoc-logo-white.png" alt="PSOC Logo" style="height: 125px; opacity: 0.95; display: inline-block; margin: 0 auto; border: none;" />
                    </a>
                  </div>

                  <!-- SPACING (35px on Desktop to shift whole assembly upward) -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                    <tr><td class="header-gap" height="35" style="font-size: 35px; line-height: 35px; mso-line-height-rule: exactly;">&nbsp;</td></tr>
                  </table>

                  <!-- MAIN HERO CONTENT (Landscape on Desktop/Tablet, Portrait Stack on Phone) -->
                  <table class="mobile-stack" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="border-collapse: collapse;">
                    <tr class="mobile-stack">
                      
                      <!-- LEFT COLUMN: Main Title Top, Status Below (Left-Aligned Desktop, Centered Mobile) -->
                      <td class="mobile-col left-col" width="42%" align="left" valign="middle" style="padding-right: 35px;">
                        
                        <!-- MAIN TITLE (Reduced to 129px on Desktop) -->
                        <h1 class="title-text" style="font-family: 'Bebas Neue', Impact, Arial, sans-serif; font-size: 129px; line-height: 0.85; text-transform: uppercase; color: #ffffff; margin: 0; padding: 0; letter-spacing: 0px;">
                          ${albumTitle}
                        </h1>
                        
                        <!-- SUBTITLE (40px on Desktop) -->
                        <div class="status-text" style="font-family: 'Bebas Neue', Impact, Arial, sans-serif; font-size: 40px; font-weight: 400; text-transform: uppercase; color: #a3a3a3; letter-spacing: 1px; margin: 0; padding: 0; line-height: 1; margin-top: 45px;">
                          ALBUM IS LIVE
                        </div>
                        <div class="divider-line" style="border-top: 3px solid #a3a3a3; width: 45px; margin-top: 15px;"></div>
                        
                      </td>

                      <!-- RIGHT COLUMN: Clickable Image + Button (58% width on Desktop) -->
                      <td class="mobile-col" width="58%" align="right" valign="middle">
                        
                        <!-- CLICKABLE IMAGE -->
                        <a href="${albumUrl}" target="_blank" class="group-container">
                          
                          <div class="deep-glow"></div>
                          <div class="base-glow"></div>
                          
                          <div class="image-box">
                            <img src="${albumCoverUrl}" alt="${collectionName} Cover" />
                            
                            <div class="event-highlight">
                              <span class="beam-dot"></span><span style="display: inline-block; vertical-align: middle;">ANNUAL EVENT</span>
                            </div>
                            
                            <div class="hover-arrow">&#10095;</div>
                          </div>
                        </a>

                        <!-- BUTTON #6: SUBTLE WHITE GLOW & TRIPLE CHEVRON TRANSITION -->
                        <div class="pill-button-wrapper">
                          <a href="${albumUrl}" target="_blank" class="glow-pill-button">
                            <span>View Album</span>
                            <span class="arrow-single">&nbsp;&#8250;</span>
                            <span class="arrow-triple">&nbsp;&#8250;&#8250;&#8250;</span>
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