import type { NextFunction, Request, Response } from "express";
import userDatamapper from "../datamappers/userDatamapper";

const userController = {
    // Affiche toutes les utilisateurs
    async index(_req: Request, res: Response, _next:NextFunction): Promise<void> {
    
        const users = await userDatamapper.getAllUsers();
        
        if (!users) {
            res.status(404).json({ error: "Utilisateurs introuvables." });
            return;
        }
    },

    // Affiche un utilisateur
    async show(req: Request, res: Response, _next:NextFunction): Promise<void> {
        const id = Number(req.params.id);
    
        if (!id) {
            res.status(400).json({ error: "ID invalide." });
            return;
        }
    
        const user = await userDatamapper.getUserById(id);
        
        if (!user) {
            res.status(404).json({ error: "Utilisateur introuvable." });
            return _next();
        }
    },


    // Mettre à jour un utilisateur
    async update(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const id = Number(req.params.id);
        const data = req.body;

        if (!id) {
            res.status(400).json({ error: "ID invalide." });
            return;
        }

        const user = await userDatamapper.getUserById(id);
        if (!user){
            return _next();
        }
        await userDatamapper.updateUser(data);
        res.status(200).json({ message: "Utilisateur mise à jour avec succès." })
    },

    // Supprimer un utilisateur
    async destroy(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const id = Number(req.params.id);

        const user = await userDatamapper.removeUser(id);

        if (!user){
            return _next();
        }
        res.status(200).json({ message: "Utilisateur supprimée avec succès." })
    },

};

export default userController;