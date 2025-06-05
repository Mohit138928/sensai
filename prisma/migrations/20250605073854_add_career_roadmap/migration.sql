/*
  Warnings:

  - Changed the type of `timeline` on the `CareerRoadmap` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CareerRoadmap" DROP COLUMN "timeline",
ADD COLUMN     "timeline" JSONB NOT NULL;
