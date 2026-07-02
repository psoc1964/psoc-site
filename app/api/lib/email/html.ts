import {
  EmailComponent,
  EmailComponentType,
  TemplateLayoutOptions,
} from "@backend/lib/email/types";

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
        `<ul style="margin:0;padding-left:16px;margin-top:0;margin-bottom:0;">
${component.items
  .map(
    (item) =>
      `<li style="margin-bottom:8px;font-size:16px;color:#ffffff;">${item}</li>`,
  )
  .join("")}
</ul>
      `,
        component.options,
      );
    case EmailComponentType.IMAGE:
      return getTemplateLayout(
        `
      <img alt="" src="${component.url}" style="margin:0;border:none;max-width:100%;height:auto;object-fit:cover;display:block;border-radius:8px;width:${component.width}px;" width="${component.width}" class="CToWUd" data-bit="iit">
      `,
        component.options,
      );
    case EmailComponentType.GRID:
      return buildTemplate(component.components);
    case EmailComponentType.BUTTON:
      return getTemplateLayout(
        `<a href="${component.url}" target="_blank" style="display:inline-block;background-color:#ffffff;color:#000000;padding:12px 20px;border-radius:8px;text-decoration:none;font-size:16px;line-height:20px;border:0;">${component.content}</a>`,
        {
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
          ...component.options,
        },
      );
    case EmailComponentType.HEADING:
      return getTemplateLayout(
        `<h2 style="font-size:24px;line-height:32px;color:#ffffff;font-weight:600;margin:0;">${component.content}</h2>`,
        {
          marginTop: "1.5rem",
          ...component.options,
        },
      );
    case EmailComponentType.PARAGRAPH:
      return getTemplateLayout(
        `<p style="font-size:16px;color:#ffffff;margin:0;">${component.content.replaceAll("\n", "<br/>")}</p>`,
        component.options,
      );
  }
}

export const getRenderedTemplate = (
  heading: string,
  components: EmailComponent[],
) => {
  const content = buildTemplate(components);
  return getTemplateLayout(
    [
      getTemplateLayout(
        [
          getTemplateLayout(heading, {
            align: "center",
            style:
              "font-size:30px;line-height:36px;color:#5b9364;font-weight:500;",
          }),
          content,
        ],
        {
          width: 640,
          style:
            "padding:40px 20px;background-color:#ffffff;border-radius:12px;",
        },
      ),
      getTemplateLayout("PSOC", {
        align: "center",
      }),
    ],
    {
      align: "center",
      style:
        "background-color:#f5f5f5;font-family:Helvetica,Roboto,Arial,sans-serif;padding:20px 8px;color:#44475b;",
    },
  );
};

function buildTemplate(components: EmailComponent[]) {
  return getTemplateLayout(components.map((c) => getComponentHTML(c)).join(""));
}
