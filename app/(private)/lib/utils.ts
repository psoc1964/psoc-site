// function to convert thumbnail image url  from this https://drive.google.com/file/d/1abGU74O2DFaxrON3qyPw32f-FaUgk8By/view
// to this https://drive.google.com/uc?export=view&id=1abGU74O2DFaxrON3qyPw32f-FaUgk8By

/* -------------------------------------------------------------------------- */
/*                        GOOGLE DRIVE THUMBNAIL CONVERTER                    */
/* -------------------------------------------------------------------------- */

// Converts Google Drive URLs like:
// https://drive.google.com/file/d/FILE_ID/view
// https://drive.google.com/open?id=FILE_ID
// https://drive.google.com/uc?id=FILE_ID
// into a direct image URL usable in <img>

/* -------------------------------------------------------------------------- */
/*                        GOOGLE DRIVE THUMBNAIL CONVERTER                    */
/* -------------------------------------------------------------------------- */

// Converts Google Drive URLs into direct image URLs usable in <img>

export function convertDriveThumbnail(url: string): string {
  if (!url) return "";

  try {
    let fileId: string | null = null;

    // Format: /file/d/FILE_ID/view
    const fileMatch = url.match(/\/d\/([^/]+)/);
    if (fileMatch && fileMatch[1]) {
      fileId = fileMatch[1];
    }

    // Format: open?id=FILE_ID
    const openMatch = url.match(/[?&]id=([^&]+)/);
    if (!fileId && openMatch && openMatch[1]) {
      fileId = openMatch[1];
    }

    if (!fileId) return url;

    // Reliable Google image CDN
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  } catch (error) {
    console.error("Drive thumbnail conversion failed:", error);
    return url;
  }
}

/* -------------------------------------------------------------------------- */
/*                              DATE UTILS                                    */
/* -------------------------------------------------------------------------- */

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