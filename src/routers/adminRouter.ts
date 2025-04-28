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
adminRouter.get('/recette/formulaire', isAdmin, recipeAdminController.showRecipeForm)
adminRouter.post('/recette', isAdmin, recipeAdminController.showRecipeForm)
adminRouter.get('/recettes/:id', isAdmin,catchErrors(recipeAdminController.show))
adminRouter.get('/recettes/:id/edit', isAdmin,catchErrors(recipeAdminController.showEditRecipeForm))
adminRouter.post('/recettes', isAdmin, catchErrors(recipeAdminController.store))
adminRouter.patch('/recettes/:id', isAdmin, catchErrors(recipeAdminController.update))
adminRouter.post('/recettes/:id/delete', isAdmin, catchErrors(recipeAdminController.destroy));


// Gestion des utilisateurs
adminRouter.get('/users', isAdmin, catchErrors(usersAdminController.index));
adminRouter.patch('/users/:id', isAdmin, catchErrors(usersAdminController.update));
adminRouter.delete('/users/:id', isAdmin, catchErrors(usersAdminController.destroy));

// Gestion des catégories
adminRouter.get('/categories', isAdmin, catchErrors(categoryAdminController.index));
// adminRouter.get('/category:id', isAdmin, catchErrors(categoryAdminController.show));
adminRouter.get('/categories/formulaire', isAdmin, catchErrors(categoryAdminController.showCategoryForm));
adminRouter.post('/categories', isAdmin, catchErrors(categoryAdminController.showCategoryForm));
adminRouter.post('/categories', isAdmin, catchErrors(categoryAdminController.store));
// adminRouter.patch('/:id', isAdmin, catchErrors(categoryController.update));
// adminRouter.delete('/:id', isAdmin, catchErrors(categoryController.destroy));

// Médias
adminRouter.get('/medias', isAdmin, catchErrors(mediaAdminController.index));
adminRouter.get('/medias/:id', isAdmin, catchErrors(mediaAdminController.show));

// Ingrédients
adminRouter.get('/ingredients', isAdmin, catchErrors(ingredientAdminController.index));
adminRouter.get('/ingredients/:id', isAdmin, catchErrors(ingredientAdminController.show));


export default adminRouter;