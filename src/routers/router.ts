import { Router } from 'express';

const router = Router();

router.use('api/auth', authRouter);

export {router};