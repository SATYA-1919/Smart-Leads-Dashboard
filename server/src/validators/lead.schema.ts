import { z } from 'zod';
import { LeadSource, LeadStatus } from '../types';

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  status: z.enum(LeadStatus).optional(),
  source: z.enum(LeadSource),
});

export const updateLeadSchema = createLeadSchema.partial().refine(
  (val) => Object.keys(val).length > 0,
  { message: 'At least one field must be provided' }
);

export const listLeadsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(LeadStatus).optional(),
  source: z.enum(LeadSource).optional(),
  search: z.string().trim().min(1).max(120).optional(),
  sort: z.enum(['latest', 'oldest']).default('latest'),
});

export const exportLeadsQuerySchema = listLeadsQuerySchema.omit({ page: true, limit: true });

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;
export type ExportLeadsQuery = z.infer<typeof exportLeadsQuerySchema>;
