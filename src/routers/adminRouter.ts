import type { } from 'express';
import adminController from '../controllers/adminController';

const adminRouter = Router();

<<<<<<< HEAD
// Affiche le formulaire de connexion
adminRouter.get('/connexion', (_req: Request, res: Response) => {
    res.render('connexion', { errors: [] });
  });
  
  // Traite la soumission du formulaire de connexion
  adminRouter.post('/connexion', adminController.login);
  
  // Affiche le back-office (accessible uniquement aux admins)
  //adminRouter.get('/administration', adminController.show);
  
  // Route de déconnexion (logout)
  adminRouter.post('/deconnexion', adminController.logout);
  
=======
adminRouter.get('/connexion', (_req: Request, res: Response, _next: NextFunction ) => {
    res.render('connexion');
});

adminRouter.get('/connexion', adminController.login);
adminRouter.post('/connexion', adminController.login);
adminRouter.get('/administration', adminController.show)
adminRouter.delete('/admin/logout', adminController.logout)

>>>>>>> Admin : add logout router and back-office logout button

export default adminRouter;