import { z } from 'zod';

/**
 * GrowNova DigiLocker API Contract
 *
 * Shared request/response shapes for the DigiLocker consent/KYC adapter.
 */

export const KYC_DOCUMENT_TYPES = ['AADHAAR', 'PAN', 'GSTIN'] as const;

// POST /integrations/digilocker/consent
export const DigilockerConsentRequestSchema = z.object({
  documentType: z.enum(KYC_DOCUMENT_TYPES),
});

export const DigilockerConsentResponseSchema = z.object({
  consentId: z.string().uuid(),
  status: z.enum(['GRANTED']),
  documentType: z.enum(KYC_DOCUMENT_TYPES),
  provider: z.enum(['digilocker-mock']),
  expiresAt: z.string(),
});

// POST /integrations/digilocker/kyc
export const DigilockerKycRequestSchema = z.object({
  consentId: z.string().uuid(),
});

export const DigilockerKycResponseSchema = z.object({
  consentId: z.string().uuid(),
  verified: z.boolean(),
  documentType: z.enum(KYC_DOCUMENT_TYPES),
  maskedDocumentNumber: z.string(),
  provider: z.enum(['digilocker-mock']),
  verifiedAt: z.string(),
});

// TypeScript types
export type KycDocumentType = (typeof KYC_DOCUMENT_TYPES)[number];
export type DigilockerConsentRequest = z.infer<
  typeof DigilockerConsentRequestSchema
>;
export type DigilockerConsentResponse = z.infer<
  typeof DigilockerConsentResponseSchema
>;
export type DigilockerKycRequest = z.infer<typeof DigilockerKycRequestSchema>;
export type DigilockerKycResponse = z.infer<
  typeof DigilockerKycResponseSchema
>;
