-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "gstin" TEXT;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "ackDate" TIMESTAMP(3),
ADD COLUMN     "ackNo" TEXT,
ADD COLUMN     "irn" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_irn_key" ON "Invoice"("irn");

