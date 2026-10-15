-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('IN', 'OUT', 'ADJUST');

-- CreateTable
CREATE TABLE "StockLevel" (
    "variantId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockLevel_pkey" PRIMARY KEY ("variantId","locationId")
);

-- CreateTable
CREATE TABLE "StockLedgerEntry" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "balanceAfter" DECIMAL(12,3) NOT NULL,
    "unitCost" DECIMAL(12,2) NOT NULL,
    "reference" TEXT,
    "note" TEXT,
    "actorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StockLevel_businessId_locationId_idx" ON "StockLevel"("businessId", "locationId");

-- CreateIndex
CREATE INDEX "StockLedgerEntry_businessId_variantId_locationId_createdAt_idx" ON "StockLedgerEntry"("businessId", "variantId", "locationId", "createdAt");

-- CreateIndex
CREATE INDEX "StockLedgerEntry_businessId_createdAt_idx" ON "StockLedgerEntry"("businessId", "createdAt");

-- AddForeignKey
ALTER TABLE "StockLevel" ADD CONSTRAINT "StockLevel_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLevel" ADD CONSTRAINT "StockLevel_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLevel" ADD CONSTRAINT "StockLevel_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLedgerEntry" ADD CONSTRAINT "StockLedgerEntry_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLedgerEntry" ADD CONSTRAINT "StockLedgerEntry_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLedgerEntry" ADD CONSTRAINT "StockLedgerEntry_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Append-only ledger: corrections are new ADJUST entries, never edits. Rows may only go when their whole business is deleted
-- (the business row is already gone by the time its cascade reaches this table).
CREATE FUNCTION stock_ledger_append_only() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' AND NOT EXISTS (SELECT 1 FROM "Business" WHERE "id" = OLD."businessId") THEN
    RETURN OLD;
  END IF;
  RAISE EXCEPTION 'StockLedgerEntry is append-only; record a correcting movement instead';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stock_ledger_append_only BEFORE UPDATE OR DELETE ON "StockLedgerEntry"
  FOR EACH ROW EXECUTE FUNCTION stock_ledger_append_only();
