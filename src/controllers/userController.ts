import type { NextFunction, Request, Response } from "express";
import userDatamapper from "../datamappers/userDatamapper";

const userController = {

    async index(_req: Request, res: Response, _next: NextFunction): Promise<void> {
        const users = await userDatamapper.getAllUsers();

        if (!users || users.length === 0) {
            res.status(404).json({ error: "Aucun utilisateur trouvé." });
            return;
        }

        res.json(users);
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
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = Number(req.params.id);
        const { first_name, last_name } = req.body;
      
        if (!id) {
          res.status(400).json({ error: "ID invalide." });
          return;
        }
      
        const existing = await userDatamapper.getUserById(id);
        if (!existing) {
          return next();  
        }

        const updatedUser = await userDatamapper.updateUser({
          id,
          first_name,
          last_name,
          updated_at: new Date().toISOString(),
        });

        res.status(200).json({ user: updatedUser });
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