import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { ROLES } from '../constants/roles.js';
import { sendSuccess } from '../utils/ApiResponse.js';

const router = Router();

// Every route in this file requires an authenticated admin
router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/ping', (req, res) => {
  sendSuccess(res, { message: `Hello admin ${req.user.name}` });
});

export default router;