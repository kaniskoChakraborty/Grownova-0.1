-- CreateEnum
CREATE TYPE "SyncConflictType" AS ENUM ('PRICE_CHANGED', 'STOCK_SHORT', 'REJECTED');

-- CreateEnum
CREATE TYPE "SyncConflictStatus" AS ENUM ('AUTO_RESOLVED', 'OPEN', 'RESOLVED');

-- CreateTable
CREATE TABLE "PosSyncConflict" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "orderId" TEXT,
    "type" "SyncConflictType" NOT NULL,
    "status" "SyncConflictStatus" NOT NULL,
    "detail" JSONB NOT NULL,
    "note" TEXT,
    "resolvedById" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PosSyncConflict_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PosSyncConflict_businessId_status_createdAt_idx" ON "PosSyncConflict"("businessId", "status", "createdAt");

-- AddForeignKey
ALTER TABLE "PosSyncConflict" ADD CONSTRAINT "PosSyncConflict_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

