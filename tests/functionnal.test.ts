import request from 'supertest';
import app from '../src/app'; 

describe('Tests fonctionnels', () => {
  let jwtToken: string;
  let createdRecipeId: number;

  // Inscription utilisateur
  it('POST /users/signup -> crée un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send({
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@example.com',
        password: 'MotDePasse123!'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  // Connexion et récupération du JWT
  it('POST /auth/login -> retourne un token JWT', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'MotDePasse123!'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    jwtToken = res.body.token;
  });

  // Accès à une route protégée
  it('GET /recipes -> accès uniquement avec token JWT valide', async () => {
    const res = await request(app)
      .get('/recipes')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Création d'une recette
  it('POST /recipes -> crée une nouvelle recette', async () => {
    const newRecipe = {
      title: 'Test Recipe',
      category_id: 1,
      difficulty: 'easy',
      cost: 'low',
      duration: 15
    };

    const res = await request(app)
      .post('/recipes')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newRecipe);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(newRecipe.title);
    createdRecipeId = res.body.id;
  });

  // Modification d'une recette
  it('PUT /recipes/:id -> modifie une recette existante', async () => {
    const updatedData = { title: 'Updated Test Recipe' };
    const res = await request(app)
      .put(`/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updatedData.title);
  });

  // Suppression d'une recette
  it('DELETE /recipes/:id -> supprime une recette existante', async () => {
    const res = await request(app)
      .delete(`/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/supprimé/i);
  });

  // Accès à une route protégée sans token
  it('GET /recipes -> renvoie 401 si pas de token', async () => {
    const res = await request(app).get('/recipes');
    expect(res.status).toBe(401);
  });
});
