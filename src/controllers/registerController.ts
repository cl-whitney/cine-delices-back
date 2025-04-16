import type { NextFunction, Request, Response } from 'express';
import userDatamapper from '../datamappers/userDatamapper';
import Scrypt from '../helpers/scrypt';
import validateEmail from '../helpers/validateEmail';

const registerController = {
    // Le préfixe _ est une convention pour indiquer que le paramètre est présent dans la fonction.
    // Il indique qu'il n'est pas nécessairement utilisé lors de l'appel de cette dernière.
    async signup(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const { first_name, last_name, email, password } = req.body;
        const errors: string[] = [];

        // Vérifications des champs
        if (!first_name) {
        errors.push('Le champ "first_name" est obligatoire');
        }

        if (!last_name) {
        errors.push('Le champ "last_name" est obligatoire');
        }

        if (!email) {
        errors.push('Le champ "email" est obligatoire');
        } else if (!validateEmail(email)) {
        errors.push("Le format de l'email est invalide");
        }

        if (!password) {
        errors.push('Le champ "mot de passe" est obligatoire');
        }

        if (errors.length > 0) {
        res.status(400).json({ errors });
        }

        const existingUser = await userDatamapper.getUserByEmail(email);
        if (existingUser) {
        res.status(409).json({ message: 'Email déjà utilisé' });
        }

        // Hash du mot de passe
        const hashedPassword = await Scrypt.hash(password);

        // Création de l'utilisateur
        const newUser = await userDatamapper.createUser({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        });

        // On extrait la propriété "password" de l'objet "newUser" et on la renomme avec "_" (convention pour "valeur ignorée")
        // Puis on crée un nouvel objet "safeUser" contenant toutes les autres propriétés sauf "password"
        // Cela permet de ne pas envoyer le mot de passe dans la réponse JSON, même s'il est hashé
        const { password: _, ...safeUser } = newUser;

        res.status(201).json({
        message: 'Compte utilisateur créé avec succès',
        user: safeUser,
        });
    }
};

export default registerController;

// Explications détaillées
// { password: _ }

//     Ça signifie : "Extrais la propriété password de newUser, et stocke-la dans une variable _."

//     Le _ est juste un nom de variable ici (il n’a pas de signification spéciale, c’est une convention).

//     On ne s’en servira pas, c’est pour jeter la propriété password.

// ...safeUser

//     C’est l’opérateur de reste (rest operator)

//     Il crée un nouvel objet safeUser qui contient toutes les propriétés de newUser sauf password (puisqu'on l’a déjà extraite juste avant).