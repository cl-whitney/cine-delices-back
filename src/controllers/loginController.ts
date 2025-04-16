import type {NextFunction, Request, Response } from "express"
import passwordValidator from 'password-validator';
import userDatamapper  from "../datamappers/userDatamapper";
import Scrypt from '../helpers/scrypt';
import { generateAuthentificationToken } from "../helpers/token";
import validateEmail from '../helpers/validateEmail';

const loginController = {
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
        const user = await userDatamapper.getUserByEmail(email);

        if (!user) {
            errors.push('Email ou mot de passe incorrect');
        }

        // Comparaison du mot de passe en clair avec celui qui est hashé en BDD
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
        
        // envoie du résultat
        // effacer le mot de passe de l'objet user
        user.password = "";

        // * après cette ligne : le user est connecté

        // Generation du token
        const token = generateAuthentificationToken(user)
        
        res.status(200).json({
            message: 'Connexion réussie',
            user,
            token: token.accessToken
        });
    },
    /**
 * La déconnexion côté JWT est gérée uniquement par le client.
 * Il suffit pour le frontend de supprimer le token du localStorage (ou du cookie).
 * Cette route ne fait que confirmer que l'utilisateur "a été déconnecté".
 */
    async logout(_: Request, res: Response, _next: NextFunction): Promise<void> {
        res.status(200).json({ message: "Déconnexion réussie (client)" });
    }

};

export default loginController;