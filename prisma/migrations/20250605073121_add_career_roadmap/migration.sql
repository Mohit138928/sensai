-- CreateTable
CREATE TABLE "CareerRoadmap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeline" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerRoadmap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CareerRoadmap_userId_idx" ON "CareerRoadmap"("userId");

-- AddForeignKey
ALTER TABLE "CareerRoadmap" ADD CONSTRAINT "CareerRoadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
