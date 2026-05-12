import {
  ALLOWED_VIDEO_MIME_TYPES,
  VIDEO_MAX_FILE_SIZE_BYTES,
  VIDEO_MAX_FILE_SIZE_MB,
} from '../shared/video/constants';

type VideoFileValidationInput = {
  size: number;
  type: string;
};

type VideoFileValidationResult =
  | {
      success: true;
    }
  | {
      success: false;

      error: string;
    };

export function validateVideoFile(
  file: VideoFileValidationInput
): VideoFileValidationResult {
  if (
    !ALLOWED_VIDEO_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_VIDEO_MIME_TYPES)[number]
    )
  ) {
    return {
      success: false,
      error: 'Only MP4 and MOV files are allowed',
    };
  }

  if (file.size > VIDEO_MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `File must be ${VIDEO_MAX_FILE_SIZE_MB} MB or smaller`,
    };
  }

  return {
    success: true,
  };
}
