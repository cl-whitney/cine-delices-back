import { Router } from 'express';
import type {Request, Response } from 'express';
import adminController from '../controllers/adminController';
import isAdmin from '../middlewares/isAdmin'

const adminRouter = Router();

// Affiche le formulaire de connexion
adminRouter.get('/connexion', (_req: Request, res: Response) => {
    res.render('connexion', { errors: [] });
  });

// adminRouter.get('/', (_req: Request, res: Response) => {
//     res.redirect('/admin/connexion');
// });

  // Traite la soumission du formulaire de connexion
adminRouter.post('/connexion', adminController.login);
  
  // Affiche le back-office (accessible uniquement aux admins)
adminRouter.get('/administration', adminController.show);
  
  // Route de déconnexion (logout)
adminRouter.post('/deconnexion', isAdmin, adminController.adminLogout);
  

export default adminRouter;