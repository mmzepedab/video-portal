import { prisma } from '@/lib/prisma';
import { createReelContainer } from './create-reel-container';
import { publishReel } from './publish-reel';
import { getInstagramPermalink } from './get-permalink';
import { waitForContainer } from './wait-for-container';
import { sendInstagramLinkToTelegram } from '@/lib/telegram/send-instagram-link';

export async function publishNextVideoToInstagram() {
  let video = await prisma.video.findFirst({
    where: {
      lastUsedAt: null,
      videoUrl: {
        startsWith: 'https://',
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  if (!video) {
    video = await prisma.video.findFirst({
      where: {
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
  }

  if (!video) {
    throw new Error('No videos available to publish');
  }

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
    },
  });

  return {
    video: updatedVideo,
    creationId,
    mediaId,
    permalink,
  };
}
