/*
  Warnings:

  - A unique constraint covering the columns `[stripeId]` on the table `Site` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_userId_fkey";

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "billingCycleStart" INTEGER,
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "stripeId" TEXT,
ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageLimit" INTEGER NOT NULL DEFAULT 1000;

-- CreateTable
CREATE TABLE "SiteInvite" (
    "email" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SiteUsers" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "SiteUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SiteInvite_projectId_idx" ON "SiteInvite"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteInvite_email_projectId_key" ON "SiteInvite"("email", "projectId");

-- CreateIndex
CREATE INDEX "SiteUsers_projectId_idx" ON "SiteUsers"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteUsers_userId_projectId_key" ON "SiteUsers"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_stripeId_key" ON "Site"("stripeId");

-- AddForeignKey
ALTER TABLE "SiteInvite" ADD CONSTRAINT "SiteInvite_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteUsers" ADD CONSTRAINT "SiteUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteUsers" ADD CONSTRAINT "SiteUsers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
