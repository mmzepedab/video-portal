import getFacebookConfig from '@/lib/facebook/facebook-config';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { pageId, pageAccessToken } = getFacebookConfig();

    const upload = await prisma.upload.findUnique({
      where: {
        id,
      },
    });

    if (!upload) {
      return Response.json({ message: `No upload found with id ${id}` });
    }

    const postVideoResponse = await fetch(
      `https://graph-video.facebook.com/v25.0/${pageId}/videos`,
      {
        method: 'POST',
        headers: '',
        body: '',
      }
    );

    //throw new Error('Error Fetching the video response');

    return Response.json({ Success: postVideoResponse });
  } catch (error) {
    return Response.json({ Error: error });
  }
}

export function GET() {
  console.log('Does this work?');
  return Response.json({ success: '1' });
}
