/*
  Warnings:

  - You are about to drop the column `instagraPermaLink` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "instagraPermaLink",
ADD COLUMN     "instagramPermalink" TEXT;
