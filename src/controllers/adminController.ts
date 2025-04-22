import type { NextFunction, Request, Response } from 'express';
import passwordValidator from 'password-validator';
import adminDatamapper from '../datamappers/adminDatamapper';
import Scrypt from '../helpers/scrypt';
import validateEmail from '../helpers/validateEmail';
import { Role } from '../types/types';


const adminController = {
    async showLoginForm(_req: Request, res: Response, _next:NextFunction){
        res.render('connexion', { errors: [] })
    },

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
        };

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

    async show(req: Request, res: Response, _next: NextFunction): Promise<void> {
        // Récupère l’utilisateur stocké en session
        const user = req.session.user;
    
        // Si pas connecté ou pas admin, on renvoie la page de connexion
        if (!user || user.role !== Role.Admin) {
          return res.status(403).render('connexion', {
            errors: ['Email ou mot de passe incorrect ou accès non autorisé'],
          });
        }
    
        // Sinon on affiche le back-office
        res.render('back-office');
      },

    async adminLogout (req: Request, res: Response, _next: NextFunction): Promise<void>{
        req.session.user = undefined;
        
        req.session.destroy((err)=> {
            if (err){
                // biome-ignore lint/suspicious/noConsole: <explanation>
                console.error("Erreur lors de la destruction de la session :", err);
                res.status(500).json({error: 'Erreur interne du serveur'})
            }
            res.redirect('/admin/connexion')
        });
    },

};

export default adminController;