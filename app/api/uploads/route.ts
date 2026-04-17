import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = formData.get('title');
    const description = formData.get('description');
    const file = formData.get('file');

    if (typeof title !== 'string' || !title.trim()) {
      return Response.json({ message: 'Title is required' }, { status: 400 });
    }

    if (typeof description !== 'string' || !description.trim()) {
      return Response.json(
        { message: 'Description is required' },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return Response.json({ message: 'File is required' }, { status: 400 });
    }

    if (!file.type.startsWith('video/')) {
      return Response.json(
        { message: 'File must be a video' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { message: 'File must be smaller than 100MB' },
        { status: 400 }
      );
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalFileName = file.name;
    const fileExtension = path.extname(originalFileName);
    const storedFileName = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, storedFileName);
    await fs.writeFile(filePath, buffer);

    console.log('title:', title);
    console.log('description:', description);
    console.log('file name:', file.name);
    console.log('file type:', file.type);
    console.log('file size:', file.size);

    const upload = await prisma.upload.create({
      data: {
        title,
        description,
        originalFileName,
        storedFileName,
        storedPath: filePath,
        mimeType: file.type,
        sizeBytes: file.size,
        status: 'uploaded',
      },
    });

    return Response.json({
      message: 'Upload received successfully',
      upload,
    });
  } catch (error) {
    console.error('Upload route error:', error);

    return Response.json(
      { message: 'Something went wrong while processing the upload' },
      { status: 500 }
    );
  }
}
