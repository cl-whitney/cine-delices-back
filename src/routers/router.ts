import { Router } from 'express';
import adminRouter from './adminRouter'
import authRouter from './authRouter';

const router = Router();

router.use('/api/auth', authRouter);
router.use('/admin', adminRouter);

export default router;