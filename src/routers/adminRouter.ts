import { type Request, type Response, Router } from 'express';
import adminController from '../controllers/adminController';

const adminRouter = Router();

// Affiche le formulaire de connexion
adminRouter.get('/connexion', (_req: Request, res: Response) => {
    res.render('connexion', { errors: [] });
  });
  
  // Traite la soumission du formulaire de connexion
  adminRouter.post('/connexion', adminController.login);
  
  // Affiche le back-office (accessible uniquement aux admins)
  adminRouter.get('/administration', adminController.show);
  
  // Route de déconnexion (logout)
  adminRouter.post('/deconnexion', adminController.logout);
  

export default adminRouter;