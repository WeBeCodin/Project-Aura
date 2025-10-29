-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('REMOTE_GLOBAL', 'HYBRID', 'ONSITE');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'TENDER', 'GRANT');

-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('AI_ML_ENGINEERING', 'VIBE_CODING', 'AI_CORPORATE_TRAINING', 'AI_GOVERNANCE', 'AI_IMPLEMENTATION', 'OTHER');

-- CreateTable
CREATE TABLE "JobListing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "locationType" "LocationType" NOT NULL,
    "jobType" "JobType" NOT NULL,
    "category" "JobCategory" NOT NULL,
    "vibeScore" INTEGER,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAuOnly" BOOLEAN NOT NULL DEFAULT false,
    "isImpactHub" BOOLEAN NOT NULL DEFAULT false,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobListing_category_idx" ON "JobListing"("category");

-- CreateIndex
CREATE INDEX "JobListing_locationType_idx" ON "JobListing"("locationType");

-- CreateIndex
CREATE INDEX "JobListing_isAuOnly_idx" ON "JobListing"("isAuOnly");

-- CreateIndex
CREATE INDEX "JobListing_isImpactHub_idx" ON "JobListing"("isImpactHub");

-- CreateIndex
CREATE INDEX "JobListing_postedAt_idx" ON "JobListing"("postedAt");
