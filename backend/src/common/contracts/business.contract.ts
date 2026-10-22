import { z } from 'zod';

/**
 * GrowNova Business API Contract
 *
 * Shared request/response shapes for business APIs.
 */

// POST /businesses
export const CreateBusinessRequestSchema = z.object({
  name: z.string().min(2).max(100),
  industry: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
});

export const CreateBusinessResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  industry: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// GET /businesses/:id
export const BusinessResponseSchema = CreateBusinessResponseSchema;

// TypeScript types
export type CreateBusinessRequest = z.infer<
  typeof CreateBusinessRequestSchema
>;

export type CreateBusinessResponse = z.infer<
  typeof CreateBusinessResponseSchema
>;

export type BusinessResponse = z.infer<typeof BusinessResponseSchema>;
