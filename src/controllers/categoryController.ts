import type { NextFunction, Request, Response } from "express";
import categoryDatamapper from "../datamappers/categoryDatamapper";


const categoryController = {
    // Affiche toutes les catégories
    async index(_req: Request, res: Response, _next:NextFunction): Promise<void> {
    
        const categorys = await categoryDatamapper.getAllCategorys();
        
        if (!categorys) {
            res.status(404).json({ error: "Catégories introuvables." });
            return;
        }
    },

    // Affiche une catégorie
    async show(req: Request, res: Response, _next:NextFunction): Promise<void> {
        const id = Number(req.params.id);
    
        if (!id) {
            res.status(400).json({ error: "ID invalide." });
            return;
        }
    
        const category = await categoryDatamapper.getCategoryById(id);
        
        if (!category) {
            res.status(404).json({ error: "Catégorie introuvable." });
            return _next();
        }
    },

    // Creer une catégorie
    async store(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const data = req.body;
    
        if (!data || !data.name ) {
            res.status(400).json({ error: "Les données de la catégorie sont invalides ou incomplètes." });
            return;
        }
    
        const category = await categoryDatamapper.createCategory(data);
    
        if (!category) {
            res.status(500).json({ error: "Échec de la création de la catégorie." });
            return;
        }
    
        res.status(201).json({ message: "Catégorie créée avec succès !", category });
    },

    // Mettre à jour une catégorie
    async update(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const id = Number(req.params.id);
        const {name} = req.body;

        if (!id) {
            res.status(400).json({ error: "ID invalide." });
            return;
        }

        const category = await categoryDatamapper.getCategoryById(id);
        if (!category){
            return _next();
        }
        await categoryDatamapper.updateCategory(name);
        res.status(200).json({ message: "Catégorie mise à jour avec succès." })
    },

    // Mettre à jour une catégorie
    async destroy(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const id = Number(req.params.id);

        const category = await categoryDatamapper.removeCategory(id);

        if (!category){
            return _next();
        }
        res.status(200).json({ message: "Catégorie supprimée à jour avec succès." })
    },

};

export default categoryController;