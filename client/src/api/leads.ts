import { apiClient } from './client';
import type {
  ApiSuccess,
  Lead,
  LeadFilters,
  LeadSource,
  LeadStatus,
  PaginationMeta,
} from '@/types';

export interface CreateLeadPayload {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export interface LeadListResponse {
  leads: Lead[];
  meta: PaginationMeta;
}

function buildParams(filters: Partial<LeadFilters>): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search && filters.search.trim()) params.search = filters.search.trim();
  if (filters.sort) params.sort = filters.sort;
  return params;
}

export async function listLeadsRequest(filters: LeadFilters): Promise<LeadListResponse> {
  const res = await apiClient.get<ApiSuccess<Lead[]>>('/leads', { params: buildParams(filters) });
  if (!res.data.meta) {
    throw new Error('Server returned no pagination metadata');
  }
  return { leads: res.data.data, meta: res.data.meta };
}

export async function getLeadRequest(id: string): Promise<Lead> {
  const res = await apiClient.get<ApiSuccess<Lead>>(`/leads/${id}`);
  return res.data.data;
}

export async function createLeadRequest(payload: CreateLeadPayload): Promise<Lead> {
  const res = await apiClient.post<ApiSuccess<Lead>>('/leads', payload);
  return res.data.data;
}

export async function updateLeadRequest(id: string, payload: UpdateLeadPayload): Promise<Lead> {
  const res = await apiClient.patch<ApiSuccess<Lead>>(`/leads/${id}`, payload);
  return res.data.data;
}

export async function deleteLeadRequest(id: string): Promise<void> {
  await apiClient.delete(`/leads/${id}`);
}

export async function exportLeadsCsvRequest(
  filters: Omit<LeadFilters, 'page' | 'limit'>
): Promise<Blob> {
  const res = await apiClient.get('/leads/export', {
    params: buildParams(filters),
    responseType: 'blob',
  });
  return res.data as Blob;
}
