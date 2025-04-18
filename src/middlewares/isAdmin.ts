import type {NextFunction, Request, Response } from "express";
import { Role } from '../types/types';

function isAdmin(req: Request, res: Response, next:NextFunction): void {
 
    const user = req.session.user;
    if (!user || user.role !== Role.Admin) {
      res.redirect ('/admin/connexion')
      return;
    }
   
    res.locals.user = user;

    next();
}

export default  isAdmin ;