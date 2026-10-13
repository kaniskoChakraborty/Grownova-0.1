-- CreateTable
CREATE TABLE "LeadStageEvent" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "fromStatus" "LeadStatus" NOT NULL,
    "toStatus" "LeadStatus" NOT NULL,
    "actorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadStageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadStageEvent_leadId_createdAt_idx" ON "LeadStageEvent"("leadId", "createdAt");

-- AddForeignKey
ALTER TABLE "LeadStageEvent" ADD CONSTRAINT "LeadStageEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadStageEvent" ADD CONSTRAINT "LeadStageEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
