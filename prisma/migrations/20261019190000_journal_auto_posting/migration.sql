-- Automatic journals for POS sales, invoices and payments; sourceId links each one to its business event.
ALTER TYPE "JournalSource" ADD VALUE 'POS_SALE';
ALTER TYPE "JournalSource" ADD VALUE 'INVOICE';
ALTER TYPE "JournalSource" ADD VALUE 'PAYMENT';

-- AlterTable
ALTER TABLE "Journal" ADD COLUMN     "sourceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Journal_businessId_source_sourceId_key" ON "Journal"("businessId", "source", "sourceId");
