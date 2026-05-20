import { apiClient } from './client';
import type { ApiSuccess, AuthUser } from '@/types';

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'Admin' | 'SalesUser';
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const res = await apiClient.post<ApiSuccess<AuthResponse>>('/auth/login', payload);
  return res.data.data;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await apiClient.post<ApiSuccess<AuthResponse>>('/auth/register', payload);
  return res.data.data;
}

export async function meRequest(): Promise<AuthUser> {
  const res = await apiClient.get<ApiSuccess<AuthUser>>('/auth/me');
  return res.data.data;
}
