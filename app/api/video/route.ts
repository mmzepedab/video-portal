import { createFile } from '@/lib/helpers/create-file';
import { prisma } from '@/lib/prisma';
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
    const { fileName } = await createFile(file);
    const videoUrl = `/uploads/${fileName}`;

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
    return NextResponse.json(
      { message: `Internal Server Error` },
      { status: 500 }
    );
  }
}
