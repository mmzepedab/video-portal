import { publishNextVideoToInstagram } from '@/lib/instagram/publish-next-video-to-instagram';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const result = await publishNextVideoToInstagram();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Error publishing video to Instagram' },
      { status: 500 }
    );
  }
}
