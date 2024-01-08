/*
  Warnings:

  - You are about to drop the column `userId` on the `Site` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Site_userId_idx";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "userId";
