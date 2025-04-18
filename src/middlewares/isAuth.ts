import type { NextFunction, Request, Response, } from 'express';
import {verifyJwtToken} from '../helpers/token'



function isAuth(req: Request, res: Response, next: NextFunction): void {
    const accessToken = req.headers.authorization?.split('Bearer ')[1]; 

    if (!accessToken) {
        res.status(401).json({ message: "Accès non autorisé. Token manquant." });
        return;
    }

    const decodedToken = verifyJwtToken(accessToken);
    if (!decodedToken) {
        res.status(401).json({ status: 401, message: "Invalid access token" });
        return;
    };
    
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (req as any).accessToken = decodedToken;
    next();
}

export default isAuth;




