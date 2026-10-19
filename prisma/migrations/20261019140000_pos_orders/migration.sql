-- CreateEnum
CREATE TYPE "PosOrderStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "InvoiceCounter" DROP CONSTRAINT "InvoiceCounter_pkey",
ADD COLUMN     "series" TEXT NOT NULL DEFAULT 'INV',
ADD CONSTRAINT "InvoiceCounter_pkey" PRIMARY KEY ("businessId", "series", "fy");

-- AlterTable
ALTER TABLE "StockLedgerEntry" ADD COLUMN     "posOrderId" TEXT;

-- CreateTable
CREATE TABLE "PosOrder" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "status" "PosOrderStatus" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "idempotencyKey" TEXT,
    "createdById" TEXT,
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PosOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosOrderLine" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "lineTotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "PosOrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PosOrder_businessId_createdAt_idx" ON "PosOrder"("businessId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PosOrder_businessId_number_key" ON "PosOrder"("businessId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "PosOrder_businessId_idempotencyKey_key" ON "PosOrder"("businessId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "PosOrderLine_orderId_idx" ON "PosOrderLine"("orderId");

-- CreateIndex
CREATE INDEX "StockLedgerEntry_posOrderId_idx" ON "StockLedgerEntry"("posOrderId");

-- AddForeignKey
ALTER TABLE "PosOrder" ADD CONSTRAINT "PosOrder_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosOrder" ADD CONSTRAINT "PosOrder_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosOrderLine" ADD CONSTRAINT "PosOrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PosOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosOrderLine" ADD CONSTRAINT "PosOrderLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

