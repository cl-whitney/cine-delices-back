import { client } from "../database/client";
import type { Recipe }  from "../types/types";
import type { Difficulty } from "../types/types";
import type { Cost } from "../types/types";
import type { Category } from "../types/types";
import type { Quantity } from "../types/types";
import type { Media } from "../types/types";

const recipeDatamapper = {
    // Ajout de catégories liées à une recette
    async addCategories(recipeId: number, cats: Category[]) {
      for (const c of cats) {
        await client.query(
          'INSERT INTO category (name, recipe_id) VALUES ($1, $2)',
          [c.name, recipeId]
        );
      }
    },
  
    // Ajout des quantités (recette–ingrédient)
    async addQuantities(recipeId: number, qts: Quantity[]) {
      for (const q of qts) {
        await client.query(
          'INSERT INTO quantity (recipe_id, ingredient_id, quantity) VALUES ($1, $2, $3)',
          [recipeId, q.ingredient_id, q.quantity]
        );
      }
    },
  
    // Ajout des médias pour une recette
    async addMedia(recipeId: number, medias: Media[]) {
        for (const m of medias) {
          await client.query(
            'INSERT INTO media (title, type, description, label, recipe_id) VALUES ($1, $2, $3, $4, $5)',
            [
              m.title,
              m.type,
              m.description  ?? null,
              m.label        ?? null,
              recipeId
            ]
          );
        }
      },
  
    // Création d'une recette
    async createRecipe(data: {
      title: string;
      image?: string;
      description?: string;
      instruction: string;
      duration: number;
      difficulty: Difficulty;
      cost: Cost;
      user_id: number;
      categories?: Category[];
      ingredients?: Quantity[];
      media?: Media[];
    }): Promise<Recipe> {
      await client.query('BEGIN');
      try {
        const insertRecipe = await client.query<Recipe>(
          'INSERT INTO recipe (title, image, description, instruction, duration, difficulty, cost, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
          [
            data.title,
            data.image ?? null,
            data.description ?? null,
            data.instruction,
            data.duration,
            data.difficulty,
            data.cost,
            data.user_id
          ]
        );
        const newRecipe = insertRecipe.rows[0];
  
        if (data.categories) {
          await this.addCategories(newRecipe.id, data.categories);
        }
        if (data.ingredients) {
          await this.addQuantities(newRecipe.id, data.ingredients);
        }
        if (data.media) {
          await this.addMedia(newRecipe.id, data.media);
        }
  
        await client.query('COMMIT');
        return newRecipe;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    },
  
    // Mise à jour d'une recette et de ses relations
    async updateRecipe(data: {
      id: number;
      title: string;
      image?: string;
      description?: string;
      instruction: string;
      duration: number;
      difficulty: Difficulty;
      cost: Cost;
      categories?: Category[];
      ingredients?: Quantity[];
      media?: Media[];
    }): Promise<Recipe> {
      await client.query('BEGIN');
      try {
        const updateRecipe = await client.query<Recipe>(
          'UPDATE recipe SET title = $1, image = $2, description = $3, instruction = $4, duration = $5, difficulty = $6, cost = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
          [
            data.title,
            data.image ?? null,
            data.description ?? null,
            data.instruction,
            data.duration,
            data.difficulty,
            data.cost,
            data.id
          ]
        );
        const updatedRecipe = updateRecipe.rows[0];
  
        if (data.categories) {
          await client.query('DELETE FROM category WHERE recipe_id = $1', [data.id]);
          await this.addCategories(data.id, data.categories);
        }
        if (data.ingredients) {
          await client.query('DELETE FROM quantity WHERE recipe_id = $1', [data.id]);
          await this.addQuantities(data.id, data.ingredients);
        }
        if (data.media) {
            await client.query('DELETE FROM media WHERE recipe_id = $1', [data.id]);
            await this.addMedia(data.id, data.media);
          }
  
        await client.query('COMMIT');
        return updatedRecipe;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    },
  
    // Suppression d'une recette
    async removeRecipe(id: number): Promise<Recipe | null> {
      const result = await client.query<Recipe>(
        'UPDATE recipe SET status = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0] ?? null;
    },
  
    // Récupérations
    async getRecipeById(id: number): Promise<Recipe> {
      const result = await client.query<Recipe>(
        'SELECT * FROM recipe WHERE id = $1',
        [id]
      );
      return result.rows[0];
    },
  
    async getAllRecipes(): Promise<Recipe[]> {
      const result = await client.query<Recipe>(
        'SELECT * FROM recipe WHERE status = true'
      );
      return result.rows;
    },
  
    async getAllRecipesByCategory(categoryId: number): Promise<Recipe[]> {
      const result = await client.query<Recipe>(
        'SELECT * FROM recipe WHERE id IN (SELECT recipe_id FROM recipe_category WHERE category_id = $1) AND status = true',
        [categoryId]
      );
      return result.rows;
    }
  };
  
  export default recipeDatamapper;