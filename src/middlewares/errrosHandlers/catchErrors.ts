import type { Response, Request, NextFunction } from 'express';


// * cette fonction doit faire les try catch à la place des méthode de controlleurs
function catchErrors(funcToExecute) {
    // * on doit avoir un middleware qui va exécute la méthode du controlleur dans un try catch
    // cette fonction va s'exécuter automatiquement
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            await funcToExecute(req, res, next);
        } catch (error) {
            // * quand on appelle next avec un argument : express lève une erreur
            next(error);
        }
    };
}

// * un middleware de gestion d'erreurs prend 4 paramètres
function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;

    console.log(err);

    res.status(status).render(status.toString(), { error: err });
}

export { catchErrors, errorHandler };