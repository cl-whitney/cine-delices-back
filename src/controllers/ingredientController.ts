import type { NextFunction, Request, Response } from "express";
import ingredientDatamapper from "../datamappers/ingredientDatamapper";

const ingredientController = {
    // Affiche tous les ingredients
    async index(_req: Request, res: Response, _next:NextFunction): Promise<void> {
    
        const ingredients = await ingredientDatamapper.getAllIngredients();
        
        if (!ingredients) {
            res.status(404).json({ error: "Ingredients introuvables." });
            return;
        }
        res.json(ingredients);
    },

    // Affiche un ingredient
    async show(req: Request, res: Response, _next:NextFunction): Promise<void> {
        const id = Number(req.params.id);
    
        if (!id) {
            res.status(400).json({ error: "ID invalide." });
            return;
        }
    
        const ingredient = await ingredientDatamapper.getIngredientById(id);
        
        if (!ingredient) {
            res.status(404).json({ error: "Ingredient introuvable." });
            return _next();
        }
        res.json(ingredient);
    },

    // Creer une ingredient
    async store(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const data = req.body;
    
        if (!data || !data.name || data.unity) {
            res.status(400).json({ error: "Les données saisies sont invalides ou incomplètes." });
            return;
        }
    
        const ingredient = await ingredientDatamapper.createIngredient(data);
    
        if (!ingredient) {
            res.status(500).json({ error: "Échec de la création de l\'ingrédient'." });
            return;
        }
    
        res.status(201).json({ message: "Ingredient créée avec succès !", ingredient });
    },

    // Mettre à jour une Ingredient
    async update(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const id = Number(req.params.id);
        const data = req.body;

        if (!id) {
            res.status(400).json({ error: "ID invalide." });
            return;
        }

        const ingredient = await ingredientDatamapper.getIngredientById(id);
        if (!ingredient){
            return _next();
        }
        await ingredientDatamapper.updateIngredient(data);
        res.status(200).json({ message: "Ingredient mise à jour avec succès." })
    },

    // Mettre à jour une Ingredient
    async destroy(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const id = Number(req.params.id);

        const ingredient = await ingredientDatamapper.removeIngredient(id);

        if (!ingredient){
            return _next();
        }
        res.status(200).json({ message: "Ingredient supprimée avec succès." })
    },

};

export default ingredientController;