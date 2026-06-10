import { NextRequest, NextResponse } from 'next/server';
import { sendNewAlbumEmail } from '@/app/api/(graphql)/Album/emailHelper';

export async function POST(req: NextRequest) {
  try {
    const { albumName, albumUrl, thumbnailUrl } = await req.json();
    const result = await sendNewAlbumEmail(albumName, albumUrl, thumbnailUrl);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Notify album error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}