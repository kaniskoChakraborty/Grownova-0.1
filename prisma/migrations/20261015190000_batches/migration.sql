-- AlterTable
ALTER TABLE "StockLedgerEntry" ADD COLUMN     "batchId" TEXT;

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "batchNo" TEXT NOT NULL,
    "mfgDate" DATE,
    "expiryDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchStock" (
    "batchId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatchStock_pkey" PRIMARY KEY ("batchId","locationId")
);

-- CreateIndex
CREATE INDEX "Batch_businessId_expiryDate_idx" ON "Batch"("businessId", "expiryDate");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_variantId_batchNo_key" ON "Batch"("variantId", "batchNo");

-- CreateIndex
CREATE INDEX "BatchStock_locationId_idx" ON "BatchStock"("locationId");

-- CreateIndex
CREATE INDEX "StockLedgerEntry_batchId_createdAt_idx" ON "StockLedgerEntry"("batchId", "createdAt");

-- AddForeignKey
ALTER TABLE "StockLedgerEntry" ADD CONSTRAINT "StockLedgerEntry_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchStock" ADD CONSTRAINT "BatchStock_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchStock" ADD CONSTRAINT "BatchStock_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

