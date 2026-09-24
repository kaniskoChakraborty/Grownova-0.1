import { z } from 'zod';

/**
 * GrowNova Auth API Contract
 *
 * This file defines the request/response shapes
 * shared by the authentication API.
 */

// POST /auth/signup
export const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
});

export const SignupResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
  }),
});

// POST /auth/login
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
  }),
});

// POST /auth/refresh
export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1),
});

export const RefreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

// TypeScript types derived from the schemas

export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type SignupResponse = z.infer<typeof SignupResponseSchema>;

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export type RefreshTokenRequest = z.infer<
  typeof RefreshTokenRequestSchema
>;

export type RefreshTokenResponse = z.infer<
  typeof RefreshTokenResponseSchema
>;
