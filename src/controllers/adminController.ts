import type { NextFunction, Request, Response } from 'express';
import passwordValidator from 'password-validator';
import adminDatamapper from '../datamappers/adminDatamapper';
import Scrypt from '../helpers/scrypt';
import validateEmail from '../helpers/validateEmail';
import { Role } from '../types/types';

const adminController = {
    async login(req: Request, res: Response, _next: NextFunction): Promise<void> {

        // Recupère MDP et Email
        const { email, password } = req.body;
        const errors = [];
        
        // validation password
        const schema = new passwordValidator();
        schema
            .is()
            .min(8) 
            .has()
            .uppercase() 
            .has()
            .lowercase() 
            .has()
            .digits(1) 
            .has()
            .not()
            .spaces() 
            .is()
            .not()
            .oneOf(['Passw0rd', 'Password123']);

        // validation email
        if (!validateEmail(email)) {
            errors.push("Le format de l'email est invalide");
        }

        // Valider par rapport à un MDP
        if (!schema.validate(password)) {
            errors.push('Email ou mot de passe incorrect');
        }

        // Si valide : on chercher user et on valide mot de passe
        const user = await adminDatamapper.getAdminByEmail(email);

        if (!user) {
            errors.push('Email ou mot de passe incorrect');
        }

        let ok = false;
        if (user) {
            ok = Scrypt.compare(password, user.password);
        }

        // const isOk = await bcrypt.compare(password, user.password);
        // console.log(isOk);
        if (!ok) {
            errors.push('Email ou mot de passe incorrect');
        }

        if (errors.length) {
            res.status(400);
        }
        
        // Si l'utilisateur n'est pas admin, revoyee le statut 403
        if (user.role !== Role.Admin){
            res.status(403).render('connexion', {
                errors: 'Accès non autorisé'
            });
        }

        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log(Role.Admin)

        // envoie du résultat
        // effacer le mot de passe de l'objet user
        const { password: _, ...safeUser } = user;

        // A partir d'ici, l'utilisateur est connecté
        req.session.user = safeUser

        res.redirect('/')
    },

    async logout (req: Request, res: Response, _next: NextFunction): Promise<void>{
        req.session.user = undefined;
        
        req.session.destroy((err)=> {
            if (err){
                // biome-ignore lint/suspicious/noConsole: <explanation>
                console.error("Erreur lors de la destruction de la session :", err);
                res.status(500).json({error: 'Erreur interne du serveur'})
            }
            res.redirect('/')
        });
    },

};

export default adminController;

