import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from './client';

export async function uploadToR2(
  fileBuffer: Buffer,
  originalFileName: string,
  contentType: string
) {
  const safeFileName = originalFileName
    .toLowerCase()
    .replaceAll(' ', '_')
    .replace(/[^a-z0-9._-]/g, '');

  const key = `videos/${Date.now()}-${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2.send(command);

  const publicUrl = process.env.R2_PUBLIC_URL
    ? `${process.env.R2_PUBLIC_URL}/${key}`
    : `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${key}`;

  return publicUrl;
}
