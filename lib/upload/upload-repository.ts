import { prisma } from '@/lib/prisma';

export type UploadPublishStatus =
  | 'not_published'
  | 'publishing'
  | 'published'
  | 'failed';

type UpdateUploadPublishStatusParams = {
  id: string;
  publishStatus: UploadPublishStatus;
  publishError?: string | null;
  facebookVideoId?: string | null;
};

export async function updateUploadPublishStatus({
  id,
  publishStatus,
  publishError,
  facebookVideoId,
}: UpdateUploadPublishStatusParams) {
  return prisma.upload.update({
    where: { id },
    data: {
      publishStatus,
      publishError,
      ...(facebookVideoId !== undefined && { facebookVideoId }),
    },
  });
}
