import crypto from 'node:crypto';
import jwt, { type Algorithm } from 'jsonwebtoken'; 
import auth from '../helpers/jwt.config'; 

// On extrait les paramètres de la config
const { audience, expiresIn, issuer, secret, type } = auth.accessToken;

// ❗ On force le typage de `algorithm` en "Algorithm"
// Cela évite l'erreur TypeScript dans jwt.sign() / jwt.verify()
// TypeScript ne peut pas deviner tout seul que c'est bien un algo valide (ex: "HS256")
const algorithm = auth.accessToken.algorithm as Algorithm;

/**
 * Génére un token d'authentification à partir d'un utilisateur
 * Retourne un objet contenant : le token, son type, sa date d'expiration
 */
export function generateAuthentificationToken(user: { id: number; email: string }) {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return {
    accessToken: {
      token: generateJwtToken(payload), // Création du JWT signé
      type, // "Bearer"
      expiresAt: createExpirationDate(expiresIn), // date d'expiration
      expiresInMS: expiresIn, // durée de vie en ms
    },
  };
}

// Signe le payload pour créer un JWT (renvoie une string JWT)
export function generateJwtToken(payload: object): string {
  return jwt.sign(payload, secret, {
    algorithm,
    audience,
    expiresIn,
    issuer,
  });
}

/**
 * Vérifie un token JWT (valide ou non)
 * Retourne les données décodées si le token est bon, sinon null
 */
export function verifyJwtToken(token: string) {
  try {
    return jwt.verify(token, secret, {
      algorithms: [algorithm], // ✅ doit être un tableau
    });
  } catch (_error) {
    return null;
  }
}

// Génére une chaîne aléatoire sécurisée (peut servir pour des tokens ou des identifiants uniques)
export function generateRandomString() {
  return crypto.randomBytes(128).toString('base64');
}

// Crée une date d'expiration future à partir de la durée (en ms)
function createExpirationDate(expiresInMs: number): Date {
  return new Date(Date.now() + expiresInMs);
}
