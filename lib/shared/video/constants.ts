export const MB = 1024 * 1024;

export const VIDEO_MAX_FILE_SIZE_MB = 100;

export const VIDEO_MAX_FILE_SIZE_BYTES = VIDEO_MAX_FILE_SIZE_MB * MB;

export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
] as const;

export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mov'] as const;
