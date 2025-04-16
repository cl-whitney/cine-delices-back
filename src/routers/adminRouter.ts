import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import adminController from '../controllers/adminController';

const adminRouter = Router();

adminRouter.get('/connexion', (_req: Request, res: Response, _next: NextFunction ) => {
    res.render('connexion');
});

adminRouter.get('/connexion', adminController.login);
adminRouter.post('/connexion', adminController.login);

export default adminRouter;