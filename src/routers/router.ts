import { Router } from 'express';
import authRouter from './authRouter';

const router = Router();

router.use('/api/auth', authRouter);

export default router;