import { prisma } from '@/lib/prisma';
import { VideoPublishStatus } from '@prisma/client';
import { createReelContainer } from './create-reel-container';
import { publishReel } from './publish-reel';
import { getInstagramPermalink } from './get-permalink';
import { waitForContainer } from './wait-for-container';
import { sendInstagramLinkToTelegram } from '@/lib/telegram/send-instagram-link';

export async function publishNextVideoToInstagram() {
  const video = await getNextReadyVideo();

  if (!video) {
    return {
      message: 'No READY videos available to publish',
    };
  }

  const reserveResult = await prisma.video.updateMany({
    where: {
      id: video.id,
      publishStatus: VideoPublishStatus.READY,
    },
    data: {
      publishStatus: VideoPublishStatus.PUBLISHING,
      publishingAt: new Date(),
      publishError: null,
    },
  });

  if (reserveResult.count === 0) {
    return {
      message: 'Another cron job already reserved this video',
    };
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

async function getNextReadyVideo() {
  const neverUsedVideo = await prisma.video.findFirst({
    where: {
      publishStatus: VideoPublishStatus.READY,
      lastUsedAt: null,
      videoUrl: {
        startsWith: 'https://',
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  if (neverUsedVideo) {
    return neverUsedVideo;
  }

  const nextUsedVideo = await prisma.video.findFirst({
    where: {
      publishStatus: VideoPublishStatus.READY,
      lastUsedAt: {
        not: null,
      },
      videoUrl: {
        startsWith: 'https://',
      },
    },
    orderBy: {
      lastUsedAt: 'asc',
    },
  });

  return nextUsedVideo;
}
