import type { FilterQuery, SortOrder } from 'mongoose';
import { Lead, type ILead } from '../models/Lead';
import type { ListLeadsQuery } from '../validators/lead.schema';
import type { PaginationMeta } from '../types';

export function buildLeadFilter(query: Omit<ListLeadsQuery, 'page' | 'limit' | 'sort'>): FilterQuery<ILead> {
  const filter: FilterQuery<ILead> = {};
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(escaped, 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  return filter;
}

export interface ListResult {
  leads: ILead[];
  meta: PaginationMeta;
}

export async function listLeads(query: ListLeadsQuery): Promise<ListResult> {
  const { page, limit, sort } = query;
  const filter = buildLeadFilter(query);
  const sortOrder: SortOrder = sort === 'oldest' ? 1 : -1;

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ILead[]>()
      .exec(),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const meta: PaginationMeta = {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { leads, meta };
}
