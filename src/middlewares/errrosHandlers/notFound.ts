import type { Response, Request, NextFunction } from 'express';

// Définition d'une classe d'erreur personnalisée qui hérite de `Error`
class HttpError extends Error {
    // Ajoute une propriété `status` pour stocker le code HTTP associé à l'erreur
    status: number; 
    constructor(message: string, status: number) {
        // Appelle le constructeur de `Error` avec le message fourni
        super(message); 
        // Stocke le code d'erreur pour être utilisé plus tard
        this.status = status; 
    }
}

function notFound(req: Request, res: Response, next: NextFunction) {
    const err = new HttpError("La ressource demandée n'existe pas", 404);
    next(err);
}


export default notFound;