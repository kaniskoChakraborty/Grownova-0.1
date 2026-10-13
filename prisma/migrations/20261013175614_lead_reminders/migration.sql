-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'SENT');

-- CreateTable
CREATE TABLE "LeadReminder" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadReminder_leadId_dueAt_idx" ON "LeadReminder"("leadId", "dueAt");

-- AddForeignKey
ALTER TABLE "LeadReminder" ADD CONSTRAINT "LeadReminder_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
