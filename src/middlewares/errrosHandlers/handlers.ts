import type { Response, Request, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';


// * cette fonction doit faire les try catch à la place des méthode de controlleurs
function catchErrors(funcToExecute: RequestHandler): RequestHandler {
    // * on doit avoir un middleware qui va exécute la méthode du controlleur dans un try catch
    // cette fonction va s'exécuter automatiquement
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
function errorHandler(err: ServerError, req: Request, res: Response, next: NextFunction) {
    const status = err.statusCode || 500; // Utilisation du code HTTP ou 500 par défaut

    console.error(err); // Log détaillé de l'erreur dans la console

    // Réponse structurée en JSON, plus adaptée aux API REST
    res.status(status).json({
        message: err.message || "Une erreur inconnue s'est produite",
        statusCode: status,
    });
}

export {errorHandler, catchErrors};
