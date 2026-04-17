import { prisma } from '@/lib/prisma';
import { createVideoSchema, videoSchema } from '@/lib/shared/video/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get request
    const videos = await prisma.video.findMany({ orderBy: { id: 'desc' } });

    // Validate
    const parsedVideos = await videoSchema.array().parse(videos);

    // Do Server Stuff

    // Return Response
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
    // Get Request Payload
    const requestJson = await req.json();
    const parsedData = createVideoSchema.safeParse(requestJson);

    // Validate Data
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

    // Process data
    const newVideo = await prisma.video.create({
      data: parsedData.data,
    });

    const videoResponse = videoSchema.parse(newVideo);

    // Return Response
    return NextResponse.json(videoResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
