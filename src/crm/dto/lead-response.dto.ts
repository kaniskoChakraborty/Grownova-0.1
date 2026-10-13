import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadSource, LeadStatus } from '../../../generated/prisma/client';
import { LEAD_INTENTS } from '../../growai/growai.rules';

export class LeadEnrichmentDto {
  @ApiProperty() summary!: string;
  @ApiProperty({ enum: [...LEAD_INTENTS] }) intent!: string;
  @ApiProperty({ type: [String] }) tags!: string[];
  @ApiProperty({ enum: ['llm', 'rules'] }) provider!: string;
  @ApiProperty({ type: String, format: 'date-time' }) enrichedAt!: string;
}

/** FE/BE contract for a lead. `status` is the pipeline stage; `score` is set when the lead is enriched. */
export class LeadResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() businessId!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) name!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) phone!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) email!: string | null;
  @ApiProperty({ enum: LeadSource }) source!: LeadSource;
  @ApiProperty({ enum: LeadStatus, description: 'Pipeline stage: NEW -> CONTACTED -> QUALIFIED -> WON / LOST' })
  status!: LeadStatus;
  @ApiPropertyOptional({ type: Number, nullable: true, minimum: 0, maximum: 100, description: 'Lead score 0-100, set by POST /crm/leads/:id/enrich; null until then' })
  score!: number | null;
  @ApiPropertyOptional({ type: String, nullable: true }) rawMessage!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) notes!: string | null;
  @ApiPropertyOptional({ type: LeadEnrichmentDto, nullable: true }) enrichment!: LeadEnrichmentDto | null;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
  @ApiProperty({ type: String, format: 'date-time' }) updatedAt!: Date;
}

class StageActorDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
}

export class LeadStageEventDto {
  @ApiProperty() id!: string;
  @ApiProperty() leadId!: string;
  @ApiProperty({ enum: LeadStatus }) fromStatus!: LeadStatus;
  @ApiProperty({ enum: LeadStatus }) toStatus!: LeadStatus;
  @ApiPropertyOptional({ type: String, nullable: true }) actorId!: string | null;
  @ApiPropertyOptional({ type: StageActorDto, nullable: true, description: 'null = moved automatically' }) actor!: StageActorDto | null;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
}
