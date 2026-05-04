import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const count = await prisma.video.count();

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to count videos' },
      { status: 500 }
    );
  }
}
