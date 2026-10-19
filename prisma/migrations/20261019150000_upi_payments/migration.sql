-- CreateEnum
CREATE TYPE "UpiCallbackResult" AS ENUM ('MATCHED', 'AMOUNT_MISMATCH', 'ORDER_NOT_PENDING', 'UNKNOWN_REF', 'FAILED');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "upiId" TEXT;

-- AlterTable
ALTER TABLE "PosOrder" ADD COLUMN     "upiTxnRef" TEXT;

-- CreateTable
CREATE TABLE "UpiPayment" (
    "id" TEXT NOT NULL,
    "businessId" TEXT,
    "orderId" TEXT,
    "txnRef" TEXT NOT NULL,
    "utr" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL,
    "payerVpa" TEXT,
    "result" "UpiCallbackResult" NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpiPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpiPayment_utr_key" ON "UpiPayment"("utr");

-- CreateIndex
CREATE INDEX "UpiPayment_businessId_receivedAt_idx" ON "UpiPayment"("businessId", "receivedAt");

-- CreateIndex
CREATE INDEX "UpiPayment_orderId_idx" ON "UpiPayment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PosOrder_upiTxnRef_key" ON "PosOrder"("upiTxnRef");

-- AddForeignKey
ALTER TABLE "UpiPayment" ADD CONSTRAINT "UpiPayment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpiPayment" ADD CONSTRAINT "UpiPayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PosOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

