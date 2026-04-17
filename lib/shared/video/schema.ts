import z from 'zod';

export const baseVideoSchema = z.object({
  title: z.string().meta({ example: 'New Way to create schema with meta' }),
  description: z
    .string()
    .meta({ example: 'Description of creating the new meta schema' }),
});

export const createVideoSchema = z
  .object({
    title: z.string().meta({
      example: 'Video de aeropuerto',
    }),
    description: z.string().meta({
      example: 'Aeropuerto internacional de Palmerola',
    }),
  })
  .meta({
    id: 'CreateVideo',
  });

export const videoSchema = createVideoSchema
  .extend({
    id: z.string().meta({
      example: '1',
    }),
  })
  .meta({
    id: 'Videos',
  });
