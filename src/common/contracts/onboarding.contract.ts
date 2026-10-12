import { z } from 'zod';

/**
 * GrowNova Onboarding API Contract
 *
 * Shared request/response shapes for onboarding APIs
 * (web onboarding and WhatsApp intake).
 */

export const INDUSTRIES = [
  'retail',
  'manufacturing',
  'services',
  'food_beverage',
  'wholesale',
  'other',
] as const;

export const UI_PRESETS = [
  'retail',
  'manufacturing',
  'services',
  'general',
] as const;

// Industry -> UI preset the frontend should load after onboarding.
export const INDUSTRY_UI_PRESET: Record<Industry, UiPreset> = {
  retail: 'retail',
  wholesale: 'retail',
  food_beverage: 'retail',
  manufacturing: 'manufacturing',
  services: 'services',
  other: 'general',
};

const BusinessProfileSchema = z.object({
  industry: z.enum(INDUSTRIES),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
});

// POST /onboarding
export const OnboardingRequestSchema = BusinessProfileSchema.extend({
  name: z.string().min(2).max(100),
});

// POST /integrations/whatsapp/intake
export const WhatsAppIntakeRequestSchema = BusinessProfileSchema.omit({
  phone: true,
}).extend({
  phone: z.string().min(5).max(30),
  businessName: z.string().min(2).max(100),
  senderName: z.string().max(100).optional(),
  message: z.string().max(4096).optional(),
});

export const OnboardingResponseSchema = z.object({
  onboardingCompleted: z.literal(true),
  channel: z.enum(['web', 'whatsapp']),
  uiPreset: z.enum(UI_PRESETS),
  business: z.object({
    id: z.string().uuid(),
    name: z.string(),
    industry: z.string().nullable(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string(),
  }),
});

// TypeScript types
export type Industry = (typeof INDUSTRIES)[number];
export type UiPreset = (typeof UI_PRESETS)[number];
export type OnboardingRequest = z.infer<typeof OnboardingRequestSchema>;
export type WhatsAppIntakeRequest = z.infer<
  typeof WhatsAppIntakeRequestSchema
>;
export type OnboardingResponse = z.infer<typeof OnboardingResponseSchema>;
