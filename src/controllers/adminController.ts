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

const recipeAdminController ={
    async index (_req: Request, res:Response, _next: NextFunction):Promise <void>{
        const recipes = await recipeDatamapper.getAllRecipes()
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log(recipes)
        res.render('recipe', { recipes, errors: []})
    },

    async show(req: Request, res:Response, _next: NextFunction):Promise <void>{
        const id = Number(req.params.id)
        const recipe = await recipeDatamapper.getRecipeById(id)
        res.render('recipe-details', { recipe, errors: [] })
    },
}; 


const usersAdminController ={
    async index (_req: Request, res:Response, _next: NextFunction):Promise <void>{
        const users = await userDatamapper.getAllUsers()

        if (!users) {
            res.status(404).json({ error: "Utilisateurs introuvables." });
            return;
        }
        res.render('users', { users, errors: []})
    },

};

const categoryAdminController={
    async index (_req: Request, res:Response, _next: NextFunction):Promise <void>{
        const category = await categoryDatamapper.getAllCategorys()
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log(category)
        res.render('categories', { category, errors: []})
    },
    // async show(req: Request, res: Response, _next: NextFunction): Promise<void> {
    //     const id = Number(req.params.id);
    //     const cat = await categoryDatamapper.getCategoryById(id);
    //     res.render('category-details', { category: cat, errors: [] });
    //   },
};

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
  };
  
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
  };







// const _categoryAdminController = {
//     async index(_req: Request, res: Response, _next:NextFunction): Promise<void> {
    
//         const categorys = await categoryDatamapper.getAllCategorys();
        
//         if (!categorys) {
//             res.status(404).json({ error: "Catégories introuvables." });
//             return;
//         }
//         res.render("categories");
//     },

//     // Affiche une catégorie
//     async show(req: Request, res: Response, _next:NextFunction): Promise<void> {
//         const id = Number(req.params.id);
    
//         if (!id) {
//             res.status(400).json({ error: "ID invalide." });
//             return;
//         }
    
//         const category = await categoryDatamapper.getCategoryById(id);
        
//         if (!category) {
//             res.status(404).json({ error: "Catégorie introuvable." });
//             return _next();
//         }
//         res.render("category-details");
//     },

//     // Creer une catégorie
//     async store(req: Request, res: Response, _next: NextFunction): Promise<void> {
//         const data = req.body;
    
//         if (!data || !data.name ) {
//             res.status(400).json({ error: "Les données de la catégorie sont invalides ou incomplètes." });
//             return;
//         }
    
//         const category = await categoryDatamapper.createCategory(data);
    
//         if (!category) {
//             res.status(500).json({ error: "Échec de la création de la catégorie." });
//             return;
//         }
    
//         res.status(201).json({ message: "Catégorie créée avec succès !", category });
//     },

//     // Mettre à jour une catégorie
//     async update(req: Request, res: Response, _next: NextFunction): Promise<void> {
//         const id = Number(req.params.id);
//         const {name} = req.body;

//         if (!id) {
//             res.status(400).json({ error: "ID invalide." });
//             return;
//         }

//         const category = await categoryDatamapper.getCategoryById(id);
//         if (!category){
//             return _next();
//         }
//         await categoryDatamapper.updateCategory(name);
//         res.status(200).json({ message: "Catégorie mise à jour avec succès." })
//     },

//     // Mettre à jour une catégorie
//     async destroy(req: Request, res: Response, _next: NextFunction): Promise<void> {
//         const id = Number(req.params.id);

//         const category = await categoryDatamapper.removeCategory(id);

//         if (!category){
//             return _next();
//         }
//         res.status(200).json({ message: "Catégorie supprimée à jour avec succès." })
//     },

// };


export {
    adminController,
    recipeAdminController,
    usersAdminController,
    categoryAdminController,
    ingredientAdminController,
    mediaAdminController,
  };