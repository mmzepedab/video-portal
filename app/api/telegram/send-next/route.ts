import { sendNextVideoToTelegram } from '@/lib/video/send-next-video-to-telegram';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const result = await sendNextVideoToTelegram();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error sending Telegram video:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send Telegram video',
      },
      { status: 500 }
    );
  }
}
