import { Router } from 'express';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

export default router;
