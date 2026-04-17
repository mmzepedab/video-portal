import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { videoSchema } from '@/lib/shared/video/schema';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }

    const parsedVideo = videoSchema.parse(video);

    return NextResponse.json(parsedVideo, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const deletedVideo = await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json(deletedVideo, { status: 200 });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
