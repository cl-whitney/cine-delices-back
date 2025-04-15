const auth = {
    accessToken: {
      // Format du token (souvent "Bearer")
      type: process.env.ACCESS_TOKEN_TYPE || "Bearer",
  
      // Algorithme utilisé pour signer les tokens JWT
      algorithm: process.env.ACCESS_TOKEN_ALGORITHM || "HS256",
  
      // Clé secrète utilisée pour signer/valider les JWT
      secret: process.env.ACCESS_TOKEN_SECRET || "Acc3ssTok3nS3c3t!",
  
      // Durée de vie du token (en millisecondes ici : 1h)
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN_MS) || 60 * 60 * 1000,
  
      // Indique pour qui est destiné le token (utile si plusieurs services consomment ton API)
      audience: process.env.ACCESS_TOKEN_AUDIENCE || "cine-delice_front",
  
      // Identifie le service qui a généré le token
      issuer: process.env.ACCESS_TOKEN_ISSUER || "cine-delice_api"
    }
  };

export default auth;