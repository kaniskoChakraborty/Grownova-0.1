import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ReminderStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

export const REMINDERS_QUEUE = 'reminders';

@Processor(REMINDERS_QUEUE)
export class RemindersProcessor extends WorkerHost {
  // Mock reminder sender: logs + live event. Swap in the WhatsApp adapter when it goes live.
  private readonly sender = new Logger('MockReminderSender');

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {
    super();
  }

  async process(job: Job<{ reminderId: string }>) {
    const reminder = await this.prisma.leadReminder.findUnique({
      where: { id: job.data.reminderId },
      include: { lead: true },
    });
    if (reminder?.status !== ReminderStatus.PENDING) return; // deleted lead or already sent

    const { lead } = reminder;
    this.sender.log(`Reminder for ${lead.name ?? lead.phone ?? lead.id}: ${reminder.note}`);
    const sent = await this.prisma.leadReminder.update({
      where: { id: reminder.id },
      data: { status: ReminderStatus.SENT, sentAt: new Date() },
    });
    this.realtime.emitToBusiness(lead.businessId, 'lead.reminder_due', { ...sent, lead });
  }
}
