import type { Request } from 'express';

export const LeadStatus = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export type LeadStatus = (typeof LeadStatus)[number];

export const LeadSource = ['Website', 'Instagram', 'Referral'] as const;
export type LeadSource = (typeof LeadSource)[number];

export const UserRole = ['Admin', 'SalesUser'] as const;
export type UserRole = (typeof UserRole)[number];

export interface AuthPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;
  errors?: Record<string, string[]> | undefined;
}
