import axios, { AxiosError } from 'axios';

function resolveBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (!raw) return '/api';
  const trimmed = raw.replace(/\/+$/, '');
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
}

export const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

const TOKEN_KEY = 'smart-leads.token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    if (error.response?.status === 401) {
      clearToken();
      const onAuthPage = window.location.pathname.startsWith('/login') ||
        window.location.pathname.startsWith('/register');
      if (!onAuthPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function extractApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message || err.message || 'Request failed';
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}
