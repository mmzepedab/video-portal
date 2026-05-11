import { VideoPublishStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { sendInstagramLinkToTelegram } from '../telegram/send-instagram-link';
import { createReelContainer } from './create-reel-container';
import { getInstagramPermalink } from './get-permalink';
import { publishReel } from './publish-reel';
import { waitForContainer } from './wait-for-container';

export async function publishVideoToInstagram(videoId: string) {
  const video = await prisma.video.findUnique({ where: { id: videoId } });

  if (!video) {
    return { message: `No video found with ${videoId}` };
  }

  if (video.publishStatus !== VideoPublishStatus.READY) {
    throw new Error('Video is not ready to publish');
  }

  try {
    const creationId = await createReelContainer({
      videoUrl: video.videoUrl,
      caption: video.description,
    });

    await waitForContainer(creationId);

    const mediaId = await publishReel(creationId);

    const permalink = await getInstagramPermalink(mediaId);

    await sendInstagramLinkToTelegram({
      title: video.title,
      permalink,
    });

    const updatedVideo = await prisma.video.update({
      where: {
        id: video.id,
      },
      data: {
        lastUsedAt: new Date(),
        publishStatus: VideoPublishStatus.READY,
        publishingAt: null,
        publishError: null,
        instagramMediaId: mediaId,
        instagramPermalink: permalink,
      },
    });

    return {
      video: updatedVideo,
      creationId,
      mediaId,
      permalink,
    };
  } catch (error) {
    await prisma.video.update({
      where: {
        id: video.id,
      },
      data: {
        publishStatus: VideoPublishStatus.FAILED,
        publishingAt: null,
        publishError:
          error instanceof Error ? error.message : 'Unknown Instagram error',
      },
    });

    throw error;
  }
}
