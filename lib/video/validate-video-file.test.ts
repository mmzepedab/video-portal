import { describe, it, expect } from 'vitest';
import { validateVideoFile } from './validate-video-file';

describe('validate video file', () => {
  it('should accept mov types', () => {
    const file = { size: 104857600, type: 'video/mov' };
    const result = validateVideoFile(file);
    expect(result.success).toBe(true);
  });

  it('should accept files exactly at 100MB', () => {
    const file = { type: 'video/mp4', size: 104857600 };
    const result = validateVideoFile(file);
    expect(result.success).toBe(true);
  });

  it('should fail if video type is different that mov or mp4', () => {
    const file = { type: 'video/png', size: 104857600 };
    const result = validateVideoFile(file);
    expect(result.success).toBe(false);
  });

  it('should fail if video size is greater than 100MB', () => {
    const file = { type: 'video/mov', size: 104857601 };
    const result = validateVideoFile(file);
    expect(result.success).toBe(false);
  });
});
