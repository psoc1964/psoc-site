import { EmailComponent, EmailComponentType } from "@backend/lib/email/types";

export const AlbumReleaseEmail = ({
  albumName,
  albumUrl,
}: {
  albumName: string;
  albumUrl: string;
}) => ({
  subject: `New album released: ${albumName}`,
  title: `New album: ${albumName}`,
  components: [
    {
      type: EmailComponentType.HEADING,
      content: `${albumName} — Out Now!`,
      options: { align: "center" },
    },
    {
      type: EmailComponentType.PARAGRAPH,
      content: `We're pleased to share ${albumName}. Take a moment to browse the new pictures.`,
      options: { align: "center" },
    },
    {
      type: EmailComponentType.BUTTON,
      content: `View Album →`,
      url: albumUrl,
      options: { align: "center" },
    },
  ] as EmailComponent[],
});
