/**
 * GrowNova OS — Centralized Typed API Client
 *
 * Architecture & Security:
 * - Centralizes HTTP requests with typed responses.
 * - Automatically attaches Bearer access tokens to same-origin / relative /api endpoints.
 * - Strictly prevents leaking authentication tokens to third-party / external origins.
 * - Extracts human-friendly error messages from NestJS HttpExceptionFilter without exposing sensitive data.
 * - Handles 401 responses with automatic token refresh deduplication via POST /auth/refresh.
 * - Concurrency-safe: simultaneous 401s queue behind a single shared refresh promise.
 *
 * Security Note on Refresh Tokens:
 * The current GrowNova backend contract delivers tokens in the JSON response payload and
 * expects `{ refreshToken }` in the request body (NestJS lacks cookie-parser in this batch).
 * Tokens are encapsulated in this module's storage adapter. A future batch can migrate to
 * HttpOnly secure cookies without changing consumer code.
 */

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  [key: string]: any;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorType: string;
  public readonly data?: any;

  constructor(message: string, statusCode: number, errorType: string = 'ApiError', data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
  _isRetry?: boolean;
}

// Storage keys
const ACCESS_TOKEN_KEY = 'grownova_access_token';
const REFRESH_TOKEN_KEY = 'grownova_refresh_token';

class TokenStorage {
  private inMemoryAccessToken: string | null = null;
  private inMemoryRefreshToken: string | null = null;

  constructor() {
    try {
      this.inMemoryAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      this.inMemoryRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      // Fallback for environments where localStorage is restricted
    }
  }

  getAccessToken(): string | null {
    if (this.inMemoryAccessToken) return this.inMemoryAccessToken;
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  setAccessToken(token: string | null): void {
    this.inMemoryAccessToken = token;
    try {
      if (token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    } catch {
      // Storage restricted
    }
  }

  getRefreshToken(): string | null {
    if (this.inMemoryRefreshToken) return this.inMemoryRefreshToken;
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  setRefreshToken(token: string | null): void {
    this.inMemoryRefreshToken = token;
    try {
      if (token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    } catch {
      // Storage restricted
    }
  }

  clear(): void {
    this.inMemoryAccessToken = null;
    this.inMemoryRefreshToken = null;
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // Storage restricted
    }
  }
}

export const tokenStorage = new TokenStorage();

export class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<string | null> | null = null;
  private sessionExpiredListeners: Array<() => void> = [];

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Register a listener for session expiration (e.g. redirect to login).
   */
  public onSessionExpired(listener: () => void): () => void {
    this.sessionExpiredListeners.push(listener);
    return () => {
      this.sessionExpiredListeners = this.sessionExpiredListeners.filter((l) => l !== listener);
    };
  }

  private notifySessionExpired(): void {
    tokenStorage.clear();
    this.sessionExpiredListeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in session expired listener', err);
      }
    });
    // Also dispatch a browser custom event for decoupled handlers
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('grownova:session_expired'));
    }
  }

  /**
   * Determine if the requested URL belongs to our API and is safe for attaching tokens.
   * External origins (e.g. S3, payment gateways, analytics) MUST NOT receive tokens.
   */
  private isSafeLocalOrigin(url: string): boolean {
    if (url.startsWith('/') || url.startsWith(this.baseUrl)) {
      return true;
    }
    try {
      const parsed = new URL(url, window.location.origin);
      return parsed.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  /**
   * Normalize path to ensure it starts with /api prefix when contacting backend.
   */
  private resolveUrl(path: string, params?: Record<string, any>): string {
    let resolved = path;
    if (!path.startsWith('http://') && !path.startsWith('https://')) {
      if (!path.startsWith('/api') && !path.startsWith('/api/')) {
        resolved = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
      }
    }

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        resolved += (resolved.includes('?') ? '&' : '?') + queryString;
      }
    }

    return resolved;
  }

  /**
   * Extract meaningful error messages from backend responses without exposing secrets.
   */
  private extractErrorMessage(status: number, data: any): string {
    // 1. NestJS HttpExceptionFilter structure: { success: false, error: { statusCode, message, error } }
    if (data?.error?.message) {
      if (Array.isArray(data.error.message)) {
        return data.error.message.join('. ');
      }
      if (typeof data.error.message === 'string') {
        return data.error.message;
      }
    }

    // 2. Standard NestJS error response: { statusCode, message }
    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message.join('. ');
      }
      if (typeof data.message === 'string') {
        return data.message;
      }
    }

    // 3. Fallback based on HTTP status code
    switch (status) {
      case 400:
        return 'Invalid request parameters.';
      case 401:
        return 'Authentication required. Please sign in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. The resource may already exist.';
      case 500:
        return 'An internal server error occurred. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Backend service is currently unavailable. Please check your connection.';
      default:
        return `Request failed with status ${status}.`;
    }
  }

  /**
   * Thread-safe refresh token mechanism.
   * If multiple requests trigger 401 simultaneously, all await the same in-flight refresh.
   */
  private async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      this.notifySessionExpired();
      return null;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshUrl = this.resolveUrl('/auth/refresh');
        const res = await fetch(refreshUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
          throw new Error('Refresh failed');
        }

        const data = await res.json();
        const newAccessToken = data.accessToken;
        if (!newAccessToken) {
          throw new Error('No access token in refresh response');
        }

        tokenStorage.setAccessToken(newAccessToken);
        return newAccessToken;
      } catch {
        this.notifySessionExpired();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Core request method.
   */
  public async request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
    const {
      body,
      params,
      headers: customHeaders = {},
      skipAuth = false,
      _isRetry = false,
      ...restOptions
    } = options;

    const url = this.resolveUrl(path, params);
    const headers = new Headers(customHeaders);

    // Attach Bearer token only for safe origins
    if (!skipAuth && this.isSafeLocalOrigin(url)) {
      const token = tokenStorage.getAccessToken();
      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // Configure body and Content-Type
    let formattedBody: any = body;
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const isBlob = typeof Blob !== 'undefined' && body instanceof Blob;

    if (body !== undefined && body !== null) {
      if (isFormData) {
        // Let browser set the correct multipart/form-data boundary header automatically
        headers.delete('Content-Type');
        formattedBody = body;
      } else if (isBlob) {
        formattedBody = body;
      } else if (typeof body === 'object') {
        if (!headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json');
        }
        formattedBody = JSON.stringify(body);
      }
    }

    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...restOptions,
        headers,
        body: formattedBody,
      });
    } catch (networkError: any) {
      throw new ApiError(
        'Unable to connect to backend server. Please check your network or server status.',
        0,
        'NetworkError',
        networkError,
      );
    }

    // Handle 401 Unauthorized with token refresh (once per request)
    if (response.status === 401 && !skipAuth && !_isRetry && !path.includes('/auth/login') && !path.includes('/auth/refresh')) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        return this.request<T>(path, {
          ...options,
          _isRetry: true,
        });
      }
    }

    // Parse response
    let responseData: any = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }
    } else {
      try {
        responseData = await response.text();
      } catch {
        responseData = null;
      }
    }

    if (!response.ok) {
      const errorMsg = this.extractErrorMessage(response.status, responseData);
      const errorType = responseData?.error?.error || response.statusText || 'HttpError';
      throw new ApiError(errorMsg, response.status, errorType, responseData);
    }

    return responseData as T;
  }

  // Convenience methods
  public get<T = any>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  public post<T = any>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  public put<T = any>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  public patch<T = any>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  }

  public delete<T = any>(path: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  public upload<T = any>(path: string, formData: FormData, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body: formData });
  }
}

export const apiClient = new ApiClient('/api');
export default apiClient;
