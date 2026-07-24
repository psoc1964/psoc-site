import {
  EmailComponent,
  EmailComponentType,
  TemplateLayoutOptions,
} from "@backend/lib/email/types";

function wrap(content: string|string[], props?: TemplateLayoutOptions){
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
  style="max-width:${props?.width?props.width+"px":"100%"};margin:${props?.marginTop || "0"} auto ${props?.marginBottom || "20px"} auto;border-collapse:collapse;">
<tr><td align="${props?.align||"left"}" style="${props?.style||""}">
${Array.isArray(content)?content.join(""):content}
</td></tr></table>`;
}

function render(c:EmailComponent):string{
 switch(c.type){
  case EmailComponentType.HEADING:
    return wrap(`<h2 style="margin:0;color:#fff;font-size:30px;font-weight:700;">${c.content}</h2>`,c.options);
  case EmailComponentType.PARAGRAPH:
    return wrap(`<p style="margin:0;color:#d1d5db;font-size:16px;line-height:28px;">${c.content.replaceAll("\n","<br/>")}</p>`,c.options);
  case EmailComponentType.BUTTON:
    return wrap(`<a href="${c.url}" style="background:#fff;color:#000;text-decoration:none;padding:16px 32px;border-radius:999px;display:inline-block;font-weight:700;">${c.content}</a>`,
    {align:"center",marginTop:"20px",marginBottom:"20px",...c.options});
  case EmailComponentType.IMAGE:
    return wrap(`<img src="${c.url}" width="${c.width}" style="display:block;border-radius:12px;width:${c.width}px;max-width:100%;height:auto;">`,c.options);
  case EmailComponentType.LIST:
    return wrap("<ul style='color:#d1d5db;padding-left:20px;'>"+c.items.map(i=>`<li style="margin-bottom:8px;">${i}</li>`).join("")+"</ul>",c.options);
  case EmailComponentType.GRID:
    return c.components.map(render).join("");
 }
}

export function getRenderedVerifyTemplate(
  heading:string,
  components:EmailComponent[]
){
 const body=components.map(render).join("");
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
${wrap(`<h1 style="color:#fff;text-align:center;font-size:38px;margin:0 0 28px;">${heading}</h1>`)}
${body}
<hr style="border:none;border-top:1px solid #2b2b2b;margin:32px 0;">
<p style="text-align:center;color:#9ca3af;font-style:italic;">Capture Moments. Create Stories.</p>
</div>
<div class="footer">© ${new Date().getFullYear()} Photographic Society, BIT Mesra</div>
</body>
</html>`;
}
