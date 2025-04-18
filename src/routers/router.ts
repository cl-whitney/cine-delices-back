import { Router } from 'express';
import adminRouter from './adminRouter'
import authRouter from './authRouter';
import categoryRouter from './categoryRouter';
import recipeRouter from './recipeRouter';

const router = Router();


router.use('/api/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/api/categories', categoryRouter);
router.use('/api/recettes', recipeRouter)


export default router;