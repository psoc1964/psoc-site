import { EmailComponent, EmailComponentType } from "@backend/lib/email/types";

export interface AlbumReleaseData {
  albumTitle: string;
  albumCoverUrl: string;
  albumUrl: string;
  collectionName: string;
  year: string;
  status: string;
}

export const AlbumReleaseEmail = ({
  albumTitle = "Athletic<br/>Meet '26",
  albumCoverUrl = "http://psocbitm.com/meet1.png",
  albumUrl = `http://localhost:3000/api/album/access?redirect=${encodeURIComponent("https://psocbitm.com/album")}`,
  collectionName = "ATHLETIC MEET '26",
  year = "2026",
  status = "NOW LIVE",
}: Partial<AlbumReleaseData> = {}) => {
  const cleanSubject = albumTitle.replace(/<br\/>/gi, " ");
  
  return {
    subject: `PSOC Album Release: ${cleanSubject}`,
    title: cleanSubject,
    components: [
      {
        type: EmailComponentType.PARAGRAPH,
        content: "EDITORIAL_ALBUM_PAYLOAD",
        options: {
          albumTitle,
          albumCoverUrl,
          albumUrl,
          collectionName,
          year,
          status,
        } as any,
      },
    ] as EmailComponent[],
  };
};