import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } });
});

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

export default router;