/*import { EmailComponent, EmailComponentType } from "@backend/lib/email/types";

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
});*/

import {
  EmailComponent,
  EmailComponentType,
} from "@backend/lib/email/types";

export const AlbumReleaseEmail = ({
  albumName,
  albumUrl,
  albumCoverUrl,
  collectionName,
  year,
  status,
}: {
  albumName: string;
  albumUrl: string;
  albumCoverUrl: string;
  collectionName: string;
  year: string;
  status: string;
}) => ({
  subject: `New album released: ${albumName}`,

  title: `New album: ${albumName}`,

  components: [
    {
      type: EmailComponentType.PARAGRAPH,

      // This is used by html.ts to identify
      // this as the special Album Release template.
      content: "EDITORIAL_ALBUM_PAYLOAD",

      options: {
        albumTitle: albumName,
        albumCoverUrl,
        collectionName,
        year,
        status,
        albumUrl,
      },
    },
  ] as EmailComponent[],
});
