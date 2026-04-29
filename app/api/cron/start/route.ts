import { startInstagramCron } from '@/lib/cron/instagram-cron';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    startInstagramCron();

    return NextResponse.json({
      success: true,
      message: 'Telegram cron started',
    });
  } catch (error) {
    console.error('Error starting Telegram cron:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to start Telegram cron',
      },
      { status: 500 }
    );
  }
}
