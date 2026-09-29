import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

import {
  DigilockerConsentResponse,
  DigilockerKycResponse,
  KycDocumentType,
} from '../../common/contracts';

/**
 * Consent/KYC adapter contract. Swap MockDigilockerAdapter for a real
 * DigiLocker client in DigilockerModule without touching callers.
 */
export abstract class DigilockerAdapter {
  abstract requestConsent(
    businessId: string,
    documentType: KycDocumentType,
  ): Promise<DigilockerConsentResponse>;

  abstract verifyKyc(
    businessId: string,
    consentId: string,
  ): Promise<DigilockerKycResponse>;
}

const CONSENT_TTL_MS = 15 * 60 * 1000;

const MOCK_DOCUMENT_NUMBERS: Record<KycDocumentType, string> = {
  AADHAAR: 'XXXX-XXXX-1234',
  PAN: 'XXXXX1234X',
  GSTIN: '07XXXXX1234X1Z5',
};

@Injectable()
export class MockDigilockerAdapter extends DigilockerAdapter {
  // In-memory only: consents are lost on restart (mock behaviour).
  private readonly consents = new Map<
    string,
    { businessId: string; documentType: KycDocumentType; expiresAt: Date }
  >();

  async requestConsent(
    businessId: string,
    documentType: KycDocumentType,
  ): Promise<DigilockerConsentResponse> {
    const consentId = randomUUID();
    const expiresAt = new Date(Date.now() + CONSENT_TTL_MS);

    this.consents.set(consentId, { businessId, documentType, expiresAt });

    return {
      consentId,
      status: 'GRANTED',
      documentType,
      provider: 'digilocker-mock',
      expiresAt: expiresAt.toISOString(),
    };
  }

  async verifyKyc(
    businessId: string,
    consentId: string,
  ): Promise<DigilockerKycResponse> {
    const consent = this.consents.get(consentId);

    if (
      !consent ||
      consent.businessId !== businessId ||
      consent.expiresAt.getTime() < Date.now()
    ) {
      throw new NotFoundException('Consent not found or expired');
    }

    this.consents.delete(consentId);

    return {
      consentId,
      verified: true,
      documentType: consent.documentType,
      maskedDocumentNumber: MOCK_DOCUMENT_NUMBERS[consent.documentType],
      provider: 'digilocker-mock',
      verifiedAt: new Date().toISOString(),
    };
  }
}
