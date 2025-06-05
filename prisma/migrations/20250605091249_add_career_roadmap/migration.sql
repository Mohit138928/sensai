-- CreateTable
CREATE TABLE "NetworkingContact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "lastContact" TIMESTAMP(3),
    "followUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkingContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkingMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkingMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NetworkingContact_userId_idx" ON "NetworkingContact"("userId");

-- CreateIndex
CREATE INDEX "NetworkingMessage_userId_idx" ON "NetworkingMessage"("userId");

-- AddForeignKey
ALTER TABLE "NetworkingContact" ADD CONSTRAINT "NetworkingContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkingMessage" ADD CONSTRAINT "NetworkingMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
