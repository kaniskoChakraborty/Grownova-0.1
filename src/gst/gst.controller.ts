import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { suggestHsn } from './hsn';

class HsnQuery {
  @ApiProperty({ example: 'basmati rice', description: 'Item or service description, or the first digits of a code' })
  @IsString() @Length(2, 100)
  q!: string;
}

class HsnSuggestionDto {
  @ApiProperty({ example: '1006' }) code!: string;
  @ApiProperty({ enum: ['HSN', 'SAC'] }) type!: 'HSN' | 'SAC';
  @ApiProperty({ example: 'Rice' }) description!: string;
}

@ApiTags('GST')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gst')
export class GstController {
  @Get('hsn')
  @ApiOkResponse({ type: [HsnSuggestionDto], description: 'Up to 5 HSN (goods) or SAC (services) codes. Indicative only, confirm on the CBIC site.' })
  hsn(@Query() query: HsnQuery) {
    return suggestHsn(query.q);
  }
}
