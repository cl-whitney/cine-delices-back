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
            ok = await Scrypt.compare(password, user.password);
        }

        // const isOk = await bcrypt.compare(password, user.password);
        // console.log(isOk);
        if (!ok) {
            errors.push('Email ou mot de passe incorrect');
        }

        if (errors.length) {
            res.status(400);
        }
        if (!user){
          return res.status(403).render('connexion', {
            errors: ['Vous n\'êtes pas autorisé à acceder à cet espace'],
        });
    }
        
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log('Objet user:', {user})
        // Vérifie si l'utilisateur existe et s'il a le rôle d'administrateur
        // Si aucun utilisateur n'est trouvé OU si son rôle n'est pas "Admin"
        // Alors on retourne une erreur 403 et on affiche la page de connexion avec un message d'erreur
        if (user.role !== Role.Admin) {
            return res.status(403).render('connexion', {
                errors: ['Email ou mot de passe incorrect ou accès non autorisé'],
            });
        }
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log('Récupère user.role',user.role)
        
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log("yes on est connecté")
        // envoie du résultat
        // effacer le mot de passe de l'objet user
        const { password: _, ...safeUser } = user;

        // A partir d'ici, l'utilisateur est connecté
        req.session.user = safeUser

        res.redirect('/admin/administration')
    },

    async show (_req: Request, res: Response, _next: NextFunction): Promise<void>{
         // Vérifie si l'utilisateur est connecté et a le rôle Admin
        // if (!req.session.user || req.session.user.role) {
        //     // Si l'utilisateur n'est pas connecté ou n'est pas un Admin, on renvoie une erreur 403
        //     return res.status(403).render('connexion', {
        //         errors: ['Email ou mot de passe incorrect ou accès non autorisé'],
        //     });
        // }
        res.render('back-office')
        
    },

    async logout (req: Request, res: Response, _next: NextFunction): Promise<void>{
        req.session.user = undefined;
        
        req.session.destroy((err)=> {
            if (err){
                // biome-ignore lint/suspicious/noConsole: <explanation>
                console.error("Erreur lors de la destruction de la session :", err);
                res.status(500).json({error: 'Erreur interne du serveur'})
            }
            res.redirect('/admin')
        });
    },

};

export default adminController;