import type {NextFunction, Request, Response } from "express";

// Extension de l'interface SessionData pour ajouter un champ user
// Permet d'accéder à req.session.user sans erreur TypeScript
declare module "express-session" {
    interface SessionData {
      user?: { last_name: string; email: string };
    }
  }

function initUserSession(req: Request, res: Response, _next:NextFunction): void {
    let user = null;
    // si on a une session avec un user : on assigne le user de la session à notre variable
    if (req.session?.user) {
        user = req.session.user;
    }

    // dans tous les cas on partage la variable avec les locals : soit user est null, soit il y en a un et on peut afficher conditionnellement des ressources
    res.locals.user = user;

    _next();
}

export default  initUserSession ;