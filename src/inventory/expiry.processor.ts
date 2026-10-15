import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { InventoryService } from './inventory.service';

export const INVENTORY_QUEUE = 'inventory';
const EXPIRY_WINDOW_DAYS = 30;

// Daily 8am IST scan: each business gets one live 'inventory.expiry_alert' listing its batches expiring within 30 days.
@Processor(INVENTORY_QUEUE)
export class ExpiryProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(ExpiryProcessor.name);

  constructor(
    @InjectQueue(INVENTORY_QUEUE) private readonly queue: Queue,
    private readonly inventory: InventoryService,
    private readonly realtime: RealtimeGateway,
  ) {
    super();
  }

  onModuleInit() {
    return this.queue.upsertJobScheduler('expiry-scan', { pattern: '0 8 * * *', tz: 'Asia/Kolkata' }, { name: 'expiry-scan' });
  }

  async process() {
    const byBusiness = new Map<string, Awaited<ReturnType<InventoryService['expiringBatches']>>>();
    for (const b of await this.inventory.expiringBatches(EXPIRY_WINDOW_DAYS)) {
      byBusiness.set(b.businessId, [...(byBusiness.get(b.businessId) ?? []), b]);
    }
    for (const [businessId, batches] of byBusiness) {
      this.realtime.emitToBusiness(businessId, 'inventory.expiry_alert', { days: EXPIRY_WINDOW_DAYS, batches });
    }
    this.logger.log(`Expiry scan: alerts sent to ${byBusiness.size} business(es)`);
    return { businesses: byBusiness.size };
  }
}
