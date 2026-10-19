import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UpiCallbackDto, UpiPaymentDto } from './dto/pos.dto';
import { PosService } from './pos.service';

// Called by the UPI provider, not a user: no JWT, the HMAC signature proves who sent it.
@ApiTags('POS')
@Controller('integrations/upi')
export class UpiController {
  constructor(private readonly pos: PosService) {}

  @Post('webhook')
  @ApiHeader({ name: 'X-Upi-Signature', description: 'hex HMAC-SHA256 of "txnRef|utr|amount(2 decimals)|status" with UPI_WEBHOOK_SECRET' })
  @ApiCreatedResponse({ type: UpiPaymentDto, description: 'Payment callback. 401 on a bad signature.' })
  webhook(@Body() dto: UpiCallbackDto, @Headers('x-upi-signature') signature?: string) {
    return this.pos.upiCallback(dto, signature);
  }
}
