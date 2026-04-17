import { promises as fs } from 'fs';

import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const upload = await prisma.upload.findUnique({
      where: {
        id,
      },
    });

    if (!upload) {
      return Response.json({ message: 'Upload not found' }, { status: 404 });
    }

    try {
      await fs.unlink(upload.storedPath);
    } catch (error) {
      console.error('File delete error:', error);
    }

    await prisma.upload.delete({
      where: {
        id,
      },
    });

    return Response.json({
      message: 'Upload deleted successfully',
    });
  } catch (error) {
    console.error('Delete route error:', error);

    return Response.json(
      { message: 'Something went wrong while deleting the upload' },
      { status: 500 }
    );
  }
}
