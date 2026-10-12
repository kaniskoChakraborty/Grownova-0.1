import { z } from 'zod';

/**
 * GrowNova Auth API Contract
 *
 * Shared request/response shapes for authentication APIs.
 */

// POST /auth/signup
export const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
  businessId: z.string().uuid(),
});

export const SignupResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.string(),
  businessId: z.string(),
});

// POST /auth/login
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: z.string(),
    businessId: z.string(),
  }),
});

// TypeScript types derived from the schemas
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type SignupResponse = z.infer<typeof SignupResponseSchema>;

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
