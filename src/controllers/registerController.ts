// ICI
import type { Request, Response} from "express";
import userDatamapper  from "../datamappers/userDatamapper";
import Scrypt from "../helpers/scrypt";
import validateEmail from '../helpers/validateEmail';

const registerController = { 
    async signup(req: Request, res: Response): Promise<Response> {
        // Verifier les champs
        const { first_name, last_name, email, password } = req.body;
        const errors = [];
        if (!first_name) {
            errors.push('Le champ firstname est obligatoire');
        }

        if (!last_name) {
            errors.push('Le champ lastname est obligatoire');
        }

        if (!email) {
            errors.push('Le champ email est obligatoire');
        }
        if (!validateEmail(email)) {
            errors.push("Le format de l'email est invalide");
        }

        //ICI
        if (!password) {
            errors.push('Le champ mot de passe est obligatoire');
        }

        const user = await userDatamapper.getUserByEmail(email);
        if (user){
            return res.status(401).json({ message: 'Email non autorisé'})
        }

        //ICI
        // Hacher le MDP
        const hashedPassword = await Scrypt.hash(password)
        
        //Creer le nouvel utilisatreur 
        const newUser = await userDatamapper.createUser({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json ({
            message: 'Compte utilisateurc crée avec succès',
            user: newUser
        })
    }
};

export default registerController;