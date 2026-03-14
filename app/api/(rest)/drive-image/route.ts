import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get("id");
  if (!fileId) return new NextResponse("Missing id", { status: 400 });

  const driveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

  try {
    const response = await fetch(driveUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      redirect: "follow",
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: 502 });
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Server error", { status: 500 });
  }
}