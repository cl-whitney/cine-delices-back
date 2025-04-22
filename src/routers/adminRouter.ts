import { Router } from 'express';
import type {} from 'express';
import adminController from '../controllers/adminController';
import categoryController from '../controllers/categoryController';
import recipeController from '../controllers/recipeController';
import userController from '../controllers/userController';
import { catchErrors } from "../middlewares/errrosHandlers/handlers";
import isAdmin from '../middlewares/isAdmin'

const adminRouter = Router();


// Afficher le formulaire de connexion
adminRouter.get('/connexion', adminController.showLoginForm);

// Traite la soumission du formulaire de connexion
adminRouter.post('/connexion', adminController.login);
  
// Affiche le back-office (accessible uniquement aux admins)
adminRouter.get('/administration', isAdmin, adminController.show);
  
// Route de déconnexion (logout)
adminRouter.post('/deconnexion', isAdmin, adminController.adminLogout);

// Gestion des recettes
adminRouter.get('/recettes', isAdmin, recipeController.index)
adminRouter.get('/:id', isAdmin,catchErrors(recipeController.show))
adminRouter.post('/', isAdmin, catchErrors(recipeController.store))
adminRouter.patch('/:id', isAdmin, catchErrors(recipeController.update))
adminRouter.delete('/', isAdmin, catchErrors(recipeController.destroy))

// Gestion des catégories
adminRouter.get('/', isAdmin, catchErrors(categoryController.index));
adminRouter.get('/:id', isAdmin, catchErrors(categoryController.show));
adminRouter.post('/', isAdmin, catchErrors(categoryController.store));
adminRouter.patch('/:id', isAdmin, catchErrors(categoryController.update));
adminRouter.delete('/:id', isAdmin, catchErrors(categoryController.destroy));

// Gestion des utilisateurs
adminRouter.get('/', isAdmin, catchErrors(userController.index));
adminRouter.get('/:id', isAdmin, catchErrors(userController.show));
adminRouter.patch('/:id', isAdmin, catchErrors(userController.update));
adminRouter.delete('/:id', isAdmin, catchErrors(userController.destroy));

export default adminRouter;