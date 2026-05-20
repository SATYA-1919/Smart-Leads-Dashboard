import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  getLead,
  getLeads,
  updateLead,
} from '../controllers/lead.controller';
import {
  createLeadSchema,
  exportLeadsQuerySchema,
  listLeadsQuerySchema,
  updateLeadSchema,
} from '../validators/lead.schema';

const router = Router();

router.use(authenticate);

// Both Admin and SalesUser can read and create/update.
// Only Admin can delete or export to CSV.
router.get('/export', validate(exportLeadsQuerySchema, 'query'), authorize('Admin'), exportLeadsCsv);

router.get('/', validate(listLeadsQuerySchema, 'query'), getLeads);
router.post('/', validate(createLeadSchema), createLead);
router.get('/:id', getLead);
router.patch('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', authorize('Admin'), deleteLead);

export default router;
