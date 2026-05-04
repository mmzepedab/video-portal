import z from 'zod';
import { uploadVideoSchema, videoSchema } from './schema';

export type VideoInput = z.infer<typeof uploadVideoSchema>;
export type Video = z.infer<typeof videoSchema>;
