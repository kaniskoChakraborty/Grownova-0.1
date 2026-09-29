import { IsIn, IsUUID } from 'class-validator';

import {
  KYC_DOCUMENT_TYPES,
  KycDocumentType,
} from '../../../common/contracts';

export class DigilockerConsentDto {
  @IsIn(KYC_DOCUMENT_TYPES)
  documentType: KycDocumentType;
}

export class DigilockerKycDto {
  @IsUUID()
  consentId: string;
}
