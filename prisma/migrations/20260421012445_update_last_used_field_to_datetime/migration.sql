/*
  Warnings:

  - The `lastUsedAt` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "lastUsedAt",
ADD COLUMN     "lastUsedAt" TIMESTAMP(3);
