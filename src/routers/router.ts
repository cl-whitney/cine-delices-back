import { Router } from 'express';
import adminRouter from './adminRouter'
import authRouter from './authRouter';
import categoryRouter from './categoryRouter';
import ingredientRouter from './ingredientsRouter';
import mediaRouter from './mediaRouter';
import recipeRouter from './recipeRouter';
import UsersRouter from './usersRouter';

const router = Router();

router.use('/api/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/api/categories', categoryRouter);
router.use('/api/recettes', recipeRouter);
router.use('api/users', UsersRouter)
router.use('api/ingredients', ingredientRouter)
router.use('api/medias', mediaRouter)

export default router;