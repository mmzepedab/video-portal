import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: { lastUsedAt: new Date() },
    });

    return NextResponse.json(updatedVideo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
