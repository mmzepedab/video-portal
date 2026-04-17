-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "facebookVideoId" TEXT,
ADD COLUMN     "publishError" TEXT,
ADD COLUMN     "publishStatus" TEXT NOT NULL DEFAULT 'not_published';
