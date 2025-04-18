import type { NextFunction, Request, RequestHandler, Response, } from 'express';


// * cette fonction doit faire les try catch à la place des méthode de controlleurs
function catchErrors(funcToExecute: RequestHandler): RequestHandler {
    // * on doit avoir un middleware qui va exécute la méthode du controlleur dans un try catch
    // cette fonction va s'exécuter automatiquement
    // biome-ignore lint/complexity/useArrowFunction: <explanation>
            return async function (req : Request, res: Response, next: NextFunction): Promise <void> {
        try {
            await funcToExecute( req, res, next);
        } catch (error) {
            // * quand on appelle next avec un argument : express lève une erreur
            next(error);
        }
    };
}

// Interface personnalisée pour gérer les erreurs avec un code HTTP
interface ServerError extends Error {
    statusCode?: number;
}

// * Un middleware de gestion d'erreurs prend 4 paramètres
function errorHandler(err: ServerError, _req: Request, res: Response, _next: NextFunction) {
    const status = err.statusCode || 500; // Utilisation du code HTTP ou 500 par défaut

    // Réponse structurée en JSON, plus adaptée aux API REST
    res.status(status).json({
        message: err.message || "Une erreur inconnue s'est produite",
        statusCode: status,
    });
}

export {errorHandler, catchErrors};
