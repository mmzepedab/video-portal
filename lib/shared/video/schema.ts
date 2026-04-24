import z from 'zod';

export const uploadVideoSchema = z.object({
  title: z.string().meta({
    example: 'Video Title',
  }),
  description: z.string().meta({
    example: 'Video Description',
  }),
  file: z.instanceof(File),
});

export const videoSchema = z
  .object({
    id: z.string().meta({
      example: '1',
    }),
    title: z.string().meta({
      example: 'Video Title',
    }),
    description: z.string().meta({
      example: 'Video Description',
    }),
    videoUrl: z.string().meta({
      example: '/uploads/video.mp4',
    }),
    lastUsedAt: z.coerce.date().nullable().meta({
      example: '2026-04-20T15:30:00.000Z',
    }),
  })
  .meta({
    id: 'Videos',
  });
