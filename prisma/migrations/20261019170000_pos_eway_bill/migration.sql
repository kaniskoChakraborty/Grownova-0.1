-- AlterTable
ALTER TABLE "PosOrder" ADD COLUMN     "ewb" JSONB,
ADD COLUMN     "ewbDate" TIMESTAMP(3),
ADD COLUMN     "ewbNo" TEXT,
ADD COLUMN     "ewbValidUntil" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "PosOrder_ewbNo_key" ON "PosOrder"("ewbNo");

