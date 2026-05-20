export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = ['Website', 'Instagram', 'Referral'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const USER_ROLES = ['Admin', 'SalesUser'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface LeadFilters {
  page: number;
  limit: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort: 'latest' | 'oldest';
}
