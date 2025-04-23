import { Router } from 'express';
import { adminController, categoryAdminController, ingredientAdminController, mediaAdminController, recipeAdminController, usersAdminController } from '../controllers/adminController';
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
adminRouter.get('/recettes', isAdmin, recipeAdminController.index)
adminRouter.get('/recettes/:id', isAdmin,catchErrors(recipeAdminController.show))
// adminRouter.post('/', isAdmin, catchErrors(recipeController.store))
// adminRouter.patch('/:id', isAdmin, catchErrors(recipeController.update))
// adminRouter.delete('/', isAdmin, catchErrors(recipeController.destroy))

// Gestion des catégories
adminRouter.get('/categories', isAdmin, catchErrors(categoryAdminController.index));
// adminRouter.get('/category:id', isAdmin, catchErrors(categoryAdminController.show));
// adminRouter.post('/', isAdmin, catchErrors(categoryController.store));
// adminRouter.patch('/:id', isAdmin, catchErrors(categoryController.update));
// adminRouter.delete('/:id', isAdmin, catchErrors(categoryController.destroy));

// Gestion des utilisateurs
adminRouter.get('/users', isAdmin, catchErrors(usersAdminController.index));
// adminRouter.get('/users/:id', isAdmin, catchErrors(userController.show));
// adminRouter.patch('/:id', isAdmin, catchErrors(userController.update));
// adminRouter.delete('/:id', isAdmin, catchErrors(userController.destroy));

// Médias
adminRouter.get('/medias', isAdmin, catchErrors(mediaAdminController.index));
adminRouter.get('/medias/:id', isAdmin, catchErrors(mediaAdminController.show));

// Ingrédients
adminRouter.get('/ingredients', isAdmin, catchErrors(ingredientAdminController.index));
adminRouter.get('/ingredients/:id', isAdmin, catchErrors(ingredientAdminController.show));


export default adminRouter;