import { promises as fs } from 'fs';

import { prisma } from '@/lib/prisma';
import getFacebookConfig from '@/lib/facebook/facebook-config';
import { updateUploadPublishStatus } from '@/lib/upload/upload-repository';

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
      return Response.json({ message: 'Upload not found' }, { status: 404 });
    }

    await updateUploadPublishStatus({
      id,
      publishStatus: 'publishing',
      publishError: null,
    });

    const startResponse = await fetch(
      `https://graph.facebook.com/v25.0/${pageId}/video_reels`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pageAccessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          upload_phase: 'start',
        }),
      }
    );

    const startData = await startResponse.json();

    if (!startResponse.ok) {
      throw new Error(
        startData.error?.message || 'Failed to start reel upload'
      );
    }

    const uploadUrl = startData.upload_url;
    const videoId = startData.video_id;

    if (!uploadUrl || !videoId) {
      throw new Error('Facebook did not return upload_url or video_id');
    }

    const fileBuffer = await fs.readFile(upload.storedPath);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `OAuth ${pageAccessToken}`,
        offset: '0',
        file_size: fileBuffer.length.toString(),
        'Content-Type': 'application/octet-stream',
      },
      body: fileBuffer,
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(
        uploadData.error?.message ||
          uploadData.message ||
          'Failed to upload binary video'
      );
    }

    const finishResponse = await fetch(
      `https://graph.facebook.com/v25.0/${pageId}/video_reels`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pageAccessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          upload_phase: 'finish',
          video_id: videoId.toString(),
          video_state: 'PUBLISHED',
          description: upload.description,
        }),
      }
    );

    const finishData = await finishResponse.json();

    if (!finishResponse.ok) {
      throw new Error(
        finishData.error?.message || 'Failed to finish reel publishing'
      );
    }

    await prisma.upload.update({
      where: {
        id,
      },
      data: {
        facebookVideoId: videoId.toString(),
        publishStatus: 'published',
        publishError: null,
      },
    });

    return Response.json({
      message: 'Reel published successfully',
      facebookVideoId: videoId,
    });
  } catch (error) {
    console.error('Publish reel route error:', error);

    try {
      const { id } = await params;

      await prisma.upload.update({
        where: {
          id,
        },
        data: {
          publishStatus: 'failed',
          publishError:
            error instanceof Error ? error.message : 'Unexpected publish error',
        },
      });
    } catch (updateError) {
      console.error('Failed to update publish status:', updateError);
    }

    return Response.json(
      { message: 'Something went wrong while publishing the reel' },
      { status: 500 }
    );
  }
}
