import { prisma } from '@/lib/prisma';
import { sendVideoToTelegram } from '../telegram/send-video';

export async function sendNextVideoToTelegram() {
  const neverUsedVideo = await prisma.video.findFirst({
    where: {
      lastUsedAt: null,
    },
  });

  const selectedVideo =
    neverUsedVideo ??
    (await prisma.video.findFirst({
      where: {
        lastUsedAt: {
          not: null,
        },
      },
      orderBy: {
        lastUsedAt: 'asc',
      },
    }));

  if (!selectedVideo) {
    return {
      success: false,
      message: 'No videos found',
    };
  }

  await prisma.video.update({
    where: {
      id: selectedVideo.id,
    },
    data: {
      lastUsedAt: new Date(),
    },
  });

  await sendVideoToTelegram({
    videoUrl: selectedVideo.videoUrl,
    caption: selectedVideo.description ?? '',
  });

  return {
    success: true,
    videoId: selectedVideo.id,
  };
}
