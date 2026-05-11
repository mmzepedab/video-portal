import { publishVideoToInstagram } from '@/lib/instagram/publish-video-to-instagram';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const result = await publishVideoToInstagram(id);

    return NextResponse.json(
      {
        message: 'Video published to Instagram successfully',
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Unknown Instagram publish error',
      },
      { status: 500 }
    );
  }
}
