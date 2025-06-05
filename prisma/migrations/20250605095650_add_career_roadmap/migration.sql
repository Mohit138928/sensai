-- CreateTable
CREATE TABLE "NegotiationSimulation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "baseOffer" DOUBLE PRECISION NOT NULL,
    "finalOffer" DOUBLE PRECISION,
    "benefits" JSONB,
    "messages" JSONB[],
    "feedback" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NegotiationSimulation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NegotiationSimulation_userId_idx" ON "NegotiationSimulation"("userId");

-- AddForeignKey
ALTER TABLE "NegotiationSimulation" ADD CONSTRAINT "NegotiationSimulation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
