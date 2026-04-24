import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export const createFile = async (file: File, folder: string = 'uploads') => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'public', folder);
  mkdir(uploadDir, { recursive: true });

  const storedFileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, storedFileName);

  await writeFile(filePath, buffer);

  return {
    fileName: storedFileName,
    url: `/${folder}/${storedFileName}`,
  };
};
