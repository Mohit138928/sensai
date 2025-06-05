-- CreateTable
CREATE TABLE "PersonalBrand" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "linkedInProfile" JSONB,
    "personalWebsite" JSONB,
    "professionalBio" TEXT,
    "contentStrategy" JSONB,
    "socialMedia" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalBrand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalBrand_userId_key" ON "PersonalBrand"("userId");

-- CreateIndex
CREATE INDEX "PersonalBrand_userId_idx" ON "PersonalBrand"("userId");

-- AddForeignKey
ALTER TABLE "PersonalBrand" ADD CONSTRAINT "PersonalBrand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
