-- CreateEnum
CREATE TYPE "VideoPublishStatus" AS ENUM ('READY', 'PUBLISHING', 'FAILED');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "instagraPermaLink" TEXT,
ADD COLUMN     "instagramMediaId" TEXT,
ADD COLUMN     "publishError" TEXT,
ADD COLUMN     "publishStatus" "VideoPublishStatus" NOT NULL DEFAULT 'READY',
ADD COLUMN     "publishingAt" TIMESTAMP(3);
