import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {verifyJwtToken} from '../helpers/token'

const SECRET_KEY = process.env.JWT_SECRET || 'superSecretKey'; 

function isAuth(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split('Bearer ')[1]; 

    if (!accessToken) {
        return res.status(401).json({ message: "Accès non autorisé. Token manquant." });
    }

  const decodedToken = verifyJwtToken(accessToken);
    if (! decodedToken) { return res.status(401).json({ status: 401, message: "Invalid access token" }); }
    
    console.log('Requete acceptée (JWT TOKEN)')
    req.accessToken = accessToken
    
    next();
  }

export default isAuth;


