import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } });
});

// Later: router.use('/auth', authRoutes); router.use('/posts', postRoutes); ...

export default router;