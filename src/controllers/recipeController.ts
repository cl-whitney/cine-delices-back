import type { NextFunction, Request, Response } from "express";
import recipeDatamapper from "../datamappers/recipeDatamapper";

const recipeController = {
    // Affiche toutes les recettes
    async index(_req: Request, res: Response, _next:NextFunction): Promise<void> {
    
        const recipes = await recipeDatamapper.getAllRecipes();
        
        if (!recipes) {
            res.status(404).json({ error: "Recettes introuvables." });
            return;
        }
        res.json(recipes);
    },

    // Affiche une recette
    async show(req: Request, res: Response, _next:NextFunction): Promise<void> {
        const id = Number(req.params.id);
    
        if (!id) {
            res.status(400).json({ error: "ID invalide." });
            return;
        }
    
        const recipe = await recipeDatamapper.getRecipeById(id);
        
        if (!recipe) {
            res.status(404).json({ error: "Recette introuvable." });
            return _next();
        }
        res.json(recipe);
    },

    // Creer une recette
    async store(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const data = req.body;
    
        if (!data || !data.title || !data.instruction || !data.duration || !data.cost) {
            res.status(400).json({ error: "Les données de la recette sont invalides ou incomplètes." });
            return;
        }
    
        const recipe = await recipeDatamapper.createRecipe(data);
    
        if (!recipe) {
            res.status(500).json({ error: "Échec de la création de la recette." });
            return;
        }
    
        res.status(201).json({ message: "Recette créée avec succès !", recipe });
    },

    // Mettre à jour une recette
    async update(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const id = Number(req.params.id);
        const data = req.body;

        if (!id) {
            res.status(400).json({ error: "ID invalide." });
            return;
        }

        const recipe = await recipeDatamapper.getRecipeById(id);
        if (!recipe){
            return _next();
        }
        await recipeDatamapper.updateRecipe(data);
        res.status(200).json({ message: "Recette mise à jour avec succès." })
    },

    // Mettre à jour une recette
    async destroy(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const id = Number(req.params.id);

        const recipe = await recipeDatamapper.removeRecipe(id);

        if (!recipe){
            return _next();
        }
        res.status(200).json({ message: "Recette supprimée avec succès." })
    },

};

export default recipeController;