import type { NextFunction, Request, Response } from 'express';
import passwordValidator from 'password-validator';
import adminDatamapper from '../datamappers/adminDatamapper';
import categoryDatamapper from '../datamappers/categoryDatamapper';
import ingredientDatamapper from '../datamappers/ingredientDatamapper';
import mediaDatamapper from '../datamappers/mediaDatamapper';
import recipeDatamapper from '../datamappers/recipeDatamapper';
import userDatamapper from '../datamappers/userDatamapper';
import Scrypt from '../helpers/scrypt';
import validateEmail from '../helpers/validateEmail';
import { Role } from '../types/types';
import type { User } from '../types/types';


const adminController = {
    async showLoginForm(_req: Request, res: Response, _next: NextFunction): Promise<void> {
        res.locals.page = "connexion";
        res.render("connexion", {page: "connexion", errors: [] });
    },
    
    async login(req: Request, res: Response, _next: NextFunction): Promise<void> {

        // Recupère MDP et Email
        const { email, password } = req.body;
        const errors = [];
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log("password:", password)
        // validation password
        const schema = new passwordValidator();
        schema
            .is()
            .min(8) 
            .has()
            .uppercase() 
            .has()
            .lowercase() 
            .has()
            .digits(1) 
            .has()
            .not()
            .spaces() 
            .is()
            .not()
            .oneOf(['Passw0rd', 'Password123']);

        // validation email
        if (!validateEmail(email)) {
            errors.push("Le format de l'email est invalide");
        }

        // Valider par rapport à un MDP
        if (!schema.validate(password)) {
            errors.push('Email ou mot de passe incorrect');
        }

        // Si valide : on chercher user et on valide mot de passe
        const user = await adminDatamapper.getAdminByEmail(email);

        if (!user) {
            errors.push('Email ou mot de passe incorrect');
        }

        let ok = false;
        if (user) {
            ok = await Scrypt.compare(password, user.password);
        }
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log(password)
        // const isOk = await bcrypt.compare(password, user.password);
        if (!ok) {
            errors.push('Email ou mot de passe incorrect');
        }

        if (errors.length) {
            res.status(400);
        }
        if (!user){
          return res.status(403).render('connexion', {
            errors: ['Vous n\'êtes pas autorisé à acceder à cet espace'],
        });
        };
        
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log('Objet user:', {user})

        // Vérifie si l'utilisateur existe et s'il a le rôle d'administrateur
        // Si aucun utilisateur n'est trouvé OU si son rôle n'est pas "Admin"
        // Alors on retourne une erreur 403 et on affiche la page de connexion avec un message d'erreur
        if (user.role !== Role.Admin) {
            return res.status(403).render('connexion', {
                errors: ['Email ou mot de passe incorrect ou accès non autorisé'],
            });
        }
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log('Récupère user.role',user.role)
        
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log("yes on est connecté")
        // envoie du résultat
        // effacer le mot de passe de l'objet user
        const { password: _, ...safeUser } = user;

        // A partir d'ici, l'utilisateur est connecté
        req.session.user = safeUser

        res.redirect('/admin/administration')
    },

    async show(req: Request, res: Response, _next: NextFunction): Promise<void> {
        // Récupère l’utilisateur stocké en session
        const user = req.session.user;
    
        // Si pas connecté ou pas admin, on renvoie la page de connexion
        if (!user || user.role !== Role.Admin) {
          return res.status(403).render('connexion', {
            errors: ['Email ou mot de passe incorrect ou accès non autorisé'],
          });
        }
        // Sinon on affiche le back-office
        res.render('back-office');
      },

    async adminLogout (req: Request, res: Response, _next: NextFunction): Promise<void>{
        req.session.user = undefined;
        
        req.session.destroy((err)=> {
            if (err){
                // biome-ignore lint/suspicious/noConsole: <explanation>
                console.error("Erreur lors de la destruction de la session :", err);
                res.status(500).json({error: 'Erreur interne du serveur'})
            }
            res.redirect('/admin/connexion')
        });
    },

};

// Gestion des recettes : 


const recipeAdminController ={
    async index (_req: Request, res:Response, _next: NextFunction):Promise <void>{
        const recipes = await recipeDatamapper.getAllRecipes()
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log(recipes)
        res.render('recipe', { recipes, errors: []})
    },

    async showRecipeForm(req: Request, res: Response, _next: NextFunction): Promise<void> {
      const formData = {
        title: "",
        image: "",
        description: "",
        instruction: "",
        duration: "",
        difficulty: "",
        cost: "",
      };
      const sessionUser = req.session.user as User;
      const userId = sessionUser.id;
  
      res.render("addRecipe", {
        formData,
        errors: [],
        userId,            // ← on le passe dans le template
      });
    },
    async show(req: Request, res:Response, _next: NextFunction):Promise <void>{
        const id = Number(req.params.id)
        const recipe = await recipeDatamapper.getRecipeById(id)
        res.render('recipe-details', { recipe, errors: [] })
    },

    async store(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {
          title,
          image,
          description,
          instruction,
          duration,
          difficulty,
          cost,
          categories,
          ingredients,
          media,
        } = req.body;
    
        const sessionUser = req.session.user as User;
        const userId = sessionUser.id;
    
        if (!title || !instruction || !duration || !difficulty || !cost) {
          return res.status(400).render('addRecipe', {
            formData: req.body,
            errors: ['Tous les champs obligatoires doivent être remplis.'],
          });
        }
    
        await recipeDatamapper.createRecipe({
          title,
          image: image || null,
          description: description || null,
          instruction,
          duration: Number(duration),
          difficulty,
          cost,
          user_id: userId,
          categories,
          ingredients,
          media,
        });
    
        res.redirect('recipe');
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const id = Number(req.params.id);
          const {
            title,
            image,
            description,
            instruction,
            duration,
            difficulty,
            cost,
            categories,
            ingredients,
            media
   
          } = req.body;
    
          if (!id || !title || !instruction || !duration || !difficulty || !cost) {
            return res
              .status(400)
              .render('recipe-details', { error: 'ID et tous les champs obligatoires doivent être fournis.' });
          }
    
          await recipeDatamapper.updateRecipe({
            id,
            title,
            image: image || null,
            description: description || null,
            instruction,
            duration,
            difficulty,
            cost,
            categories,
            ingredients,
            media

          });
    
          res.redirect('recipe');
        } catch (err) {
          next(err);
        }
      },

      async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const id = Number(req.params.id);
          if (!id) {
            return res
              .status(400)
              .render('recipe', { error: 'ID de la recette manquant.' });
          }
    
          await recipeDatamapper.removeRecipe(id);
          res.redirect('/admin/recettes');
        } catch (err) {
          next(err);
        }
      },
    };

// Gestion des Utilisateurs : 


const usersAdminController ={
    async index (_req: Request, res:Response, _next: NextFunction):Promise <void>{
        const users = await userDatamapper.getAllUsers()

        if (!users) {
            res.status(404).json({ error: "Utilisateurs introuvables." });
            return;
        }
        res.render('users', { users, errors: []})
    },
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const id = Number(req.params.id);
          const { first_name, last_name } = req.body;
          if (!id || !first_name || !last_name) {
            res.status(400);
            res.render('users', { users: [], errors: ['ID, prénom et nom sont requis.'] });
            return;
          }
          await userDatamapper.updateUser({ id, first_name, last_name });
          res.redirect('/admin/users');
        } catch (err) {
          next(err);
        }
      },
    
      async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const id = Number(req.params.id);
          if (!id) {
            res.status(400);
            res.render('users', { users: [], errors: ['ID manquant pour suppression.'] });
            return;
          }
          await userDatamapper.removeUser(id);
          res.redirect('/admin/users');
        } catch (err) {
          next(err);
        }
      },
    };
    
// Gestion des catégories : 

const categoryAdminController={
    async index (_req: Request, res:Response, _next: NextFunction):Promise <void>{
        const category = await categoryDatamapper.getAllCategorys()
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log(category)
        res.render('categories', { category, errors: []})
    },
    async store(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { name } = req.body;
          if (!name) {
            return res.status(400).render('categories', {
              categories: await categoryDatamapper.getAllCategorys(),
              errors: ['Le nom de la catégorie est requis.']
            });
          }
          await categoryDatamapper.createCategory({ name });
          res.redirect('/admin/categories');
        } catch (err) { next(err); }
      },
    
      async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const id = Number(req.params.id);
          const { name } = req.body;
          if (!id || !name) {
            return res.status(400).render('categories', {
              categories: await categoryDatamapper.getAllCategorys(),
              errors: ['ID et nom sont requis pour la mise à jour.']
            });
          }
          await categoryDatamapper.updateCategory({ id, name });
          res.redirect('/admin/categories');
        } catch (err) { next(err); }
      },
    
      async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const id = Number(req.params.id);
          if (!id) {
            return res.status(400).render('categories', {
              categories: await categoryDatamapper.getAllCategorys(),
              errors: ['ID de la catégorie manquant.']
            });
          }
          await categoryDatamapper.removeCategory(id);
          res.redirect('/admin/categories');
        } catch (err) { next(err); }
      },
    };
    


// Gestion des Ingrédients : 

const ingredientAdminController = {
    async index(_req: Request, res: Response, _next: NextFunction): Promise<void> {
      const ingredients = await ingredientDatamapper.getAllIngredients();
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log(ingredients)
      res.render('ingredients', { ingredients, errors: [] });
    },
    async show(req: Request, res: Response, _next: NextFunction): Promise<void> {
      const id = Number(req.params.id);
      const ingredient = await ingredientDatamapper.getIngredientById(id);
      res.render('ingredient-details', { ingredient, errors: [] });
    },
    async store(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { name, unity } = req.body;
          if (!name || !unity) {
            return res.status(400).render('ingredients', {
              ingredients: await ingredientDatamapper.getAllIngredients(),
              errors: ['Nom et unité sont requis.']
            });
          }
          await ingredientDatamapper.createIngredient({ name, unity });
          res.redirect('/admin/ingredients');
        } catch (err) { next(err); }
      },
    
      async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const id = Number(req.params.id);
          const { name, unity } = req.body;
          if (!id || !name || !unity) {
            return res.status(400).render('ingredients', {
              ingredients: await ingredientDatamapper.getAllIngredients(),
              errors: ['ID, nom et unité sont requis pour la mise à jour.']
            });
          }
          await ingredientDatamapper.updateIngredient({ id, name, unity });
          res.redirect('/admin/ingredients');
        } catch (err) { next(err); }
      },
    
      async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const id = Number(req.params.id);
          if (!id) {
            return res.status(400).render('ingredients', {
              ingredients: await ingredientDatamapper.getAllIngredients(),
              errors: ['ID de l’ingrédient manquant.']
            });
          }
          await ingredientDatamapper.removeIngredient(id);
          res.redirect('/admin/ingredients');
        } catch (err) { next(err); }
      },
    };


// Gestion des Médias : 

  const mediaAdminController = {
    async index(_req: Request, res: Response, _next: NextFunction): Promise<void> {
      const medias = await mediaDatamapper.getAllMedias();
      res.render('medias', { medias, errors: [] });
    },
    async show(req: Request, res: Response, _next: NextFunction): Promise<void> {
      const id = Number(req.params.id);
      const media = await mediaDatamapper.getMediaById(id);
      res.render('media-details', { media, errors: [] });
    },
    async store(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { title, type, description, label, recipeId } = req.body;
          if (!title || !type || !recipeId) {
            return res.status(400).render('medias', {
              medias: await mediaDatamapper.getAllMedias(),
              errors: ['Titre, type et ID de recette sont requis.']
            });
          }
          await mediaDatamapper.createMedia({
            title,
            type,
            description: description || null,
            label: label || null,
            recipeId: Number(recipeId)
          });
          res.redirect('/admin/medias');
        } catch (err) { next(err); }
      },
    
      async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const id = Number(req.params.id);
          const { title, type, description, label, recipeId, status } = req.body;
          if (!id || !title || !type || !recipeId || status == null) {
            return res.status(400).render('medias', {
              medias: await mediaDatamapper.getAllMedias(),
              errors: ['Tous les champs sont requis pour la mise à jour.']
            });
          }
          await mediaDatamapper.updateMedia({
            id,
            title,
            type,
            description: description || null,
            label: label || null,
            recipeId: Number(recipeId),
            status: status === 'true'
          });
          res.redirect('/admin/medias');
        } catch (err) { next(err); }
      },
    
      async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const id = Number(req.params.id);
          if (!id) {
            return res.status(400).render('medias', {
              medias: await mediaDatamapper.getAllMedias(),
              errors: ['ID du média manquant.']
            });
          }
          await mediaDatamapper.removeMedia(id);
          res.redirect('/admin/medias');
        } catch (err) { next(err); }
      },
  };


export {
    adminController,
    recipeAdminController,
    usersAdminController,
    categoryAdminController,
    ingredientAdminController,
    mediaAdminController,
  };