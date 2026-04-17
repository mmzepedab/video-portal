import z from 'zod';
import { createVideoSchema, videoSchema } from './schema';

export type VideoInput = z.infer<typeof createVideoSchema>;
export type Video = z.infer<typeof videoSchema>;
