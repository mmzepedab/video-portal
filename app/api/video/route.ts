import { prisma } from '@/lib/prisma';
import { uploadToR2 } from '@/lib/r2/upload';
import { uploadVideoSchema, videoSchema } from '@/lib/shared/video/schema';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') ?? '';
    const lastUsedAt = searchParams.get('lastUsedAtOrder');

    const videos = await prisma.video.findMany({
      orderBy: { lastUsedAt: lastUsedAt === 'desc' ? 'desc' : 'asc' },
      where: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    const parsedVideos = await videoSchema.array().parse(videos);

    return NextResponse.json(parsedVideos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const parsedData = uploadVideoSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
      file: formData.get('file'),
    });

    if (!parsedData.success) {
      return NextResponse.json(
        {
          error: parsedData.error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const { title, description, file } = parsedData.data;

    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Max 20MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const videoUrl = await uploadToR2(fileBuffer, file.name, file.type);

    const newVideo = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
      },
    });

    const videoResponse = videoSchema.parse(newVideo);

    return NextResponse.json(videoResponse, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
