/*
  Warnings:

  - You are about to drop the column `projectId` on the `SiteInvite` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `SiteUsers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,siteId]` on the table `SiteInvite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,siteId]` on the table `SiteUsers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `siteId` to the `SiteInvite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteId` to the `SiteUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SiteInvite" DROP CONSTRAINT "SiteInvite_projectId_fkey";

-- DropForeignKey
ALTER TABLE "SiteUsers" DROP CONSTRAINT "SiteUsers_projectId_fkey";

-- DropIndex
DROP INDEX "SiteInvite_email_projectId_key";

-- DropIndex
DROP INDEX "SiteInvite_projectId_idx";

-- DropIndex
DROP INDEX "SiteUsers_projectId_idx";

-- DropIndex
DROP INDEX "SiteUsers_userId_projectId_key";

-- AlterTable
ALTER TABLE "SiteInvite" DROP COLUMN "projectId",
ADD COLUMN     "siteId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SiteUsers" DROP COLUMN "projectId",
ADD COLUMN     "siteId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SiteInvite_siteId_idx" ON "SiteInvite"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteInvite_email_siteId_key" ON "SiteInvite"("email", "siteId");

-- CreateIndex
CREATE INDEX "SiteUsers_siteId_idx" ON "SiteUsers"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteUsers_userId_siteId_key" ON "SiteUsers"("userId", "siteId");

-- AddForeignKey
ALTER TABLE "SiteInvite" ADD CONSTRAINT "SiteInvite_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteUsers" ADD CONSTRAINT "SiteUsers_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
