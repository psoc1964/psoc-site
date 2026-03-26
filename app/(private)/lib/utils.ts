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