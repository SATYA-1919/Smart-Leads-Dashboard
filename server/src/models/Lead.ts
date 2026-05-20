import { Schema, model, type Document, type Model, type Types } from 'mongoose';
import { LeadStatus, LeadSource, type LeadStatus as LeadStatusType, type LeadSource as LeadSourceType } from '../types';

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatusType;
  source: LeadSourceType;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    status: { type: String, enum: LeadStatus, default: 'New', required: true, index: true },
    source: { type: String, enum: LeadSource, required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

leadSchema.index({ name: 'text', email: 'text' });
leadSchema.index({ createdAt: -1 });

export const Lead: Model<ILead> = model<ILead>('Lead', leadSchema);
