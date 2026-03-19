export function convertDriveThumbnail(url: string): string {
  if (!url) return "";

  try {
    let fileId: string | null = null;

    const fileMatch = url.match(/\/d\/([^/]+)/);
    if (fileMatch?.[1]) fileId = fileMatch[1];

    const openMatch = url.match(/[?&]id=([^&]+)/);
    if (!fileId && openMatch?.[1]) fileId = openMatch[1];

    if (!fileId) return url;

    return `/api/drive-image?id=${fileId}`;
  } catch (error) {
    console.error("Drive thumbnail conversion failed:", error);
    return url;
  }
}

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