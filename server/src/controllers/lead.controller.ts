import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Lead, type ILead } from '../models/Lead';
import { toCsv, type CsvColumn } from '../utils/csv';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { listLeads, buildLeadFilter } from '../services/lead.service';
import type {
  CreateLeadInput,
  UpdateLeadInput,
  ListLeadsQuery,
  ExportLeadsQuery,
} from '../validators/lead.schema';
import type { AuthenticatedRequest } from '../types';

function getUserId(req: Request): string {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) throw ApiError.unauthorized();
  return authReq.user.id;
}

function assertValidId(id: string): void {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid lead id');
}

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateLeadInput;
  const createdBy = getUserId(req);
  const lead = await Lead.create({ ...body, createdBy });
  res.status(201).json({ success: true, data: lead });
});

export const getLead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  assertValidId(id);
  const lead = await Lead.findById(id);
  if (!lead) throw ApiError.notFound('Lead not found');
  res.json({ success: true, data: lead });
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  assertValidId(id);
  const body = req.body as UpdateLeadInput;
  const lead = await Lead.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!lead) throw ApiError.notFound('Lead not found');
  res.json({ success: true, data: lead });
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  assertValidId(id);
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) throw ApiError.notFound('Lead not found');
  res.json({ success: true, message: 'Lead deleted' });
});

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ListLeadsQuery;
  const { leads, meta } = await listLeads(query);
  res.json({ success: true, data: leads, meta });
});

export const exportLeadsCsv = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ExportLeadsQuery;
  const filter = buildLeadFilter(query);
  const sortOrder = query.sort === 'oldest' ? 1 : -1;

  const leads = await Lead.find(filter).sort({ createdAt: sortOrder }).lean<ILead[]>();

  const columns: CsvColumn<ILead>[] = [
    { label: 'Name', value: (row) => row.name },
    { label: 'Email', value: (row) => row.email },
    { label: 'Status', value: (row) => row.status },
    { label: 'Source', value: (row) => row.source },
    { label: 'Created At', value: (row) => new Date(row.createdAt).toISOString() },
  ];

  const csv = toCsv(columns, leads);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="leads-${Date.now()}.csv"`);
  res.send(csv);
});
