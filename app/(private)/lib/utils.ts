export function getYearFromDate(date: string | Date): number {
  return new Date(date).getFullYear();
}

export function getMonthFromDate(date: string | Date): number {
  return new Date(date).getMonth() + 1;
}

export function formatAlbumDate(date: string | Date): string {
  const parsedDate = new Date(date);

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
export function toDriveThumbnail(url: string | undefined | null, size = "w800"): string {
  if (!url) return "";
  if (url.includes("drive.google.com/thumbnail")) return url;
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=${size}`;
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=${size}`;
  return url;
}