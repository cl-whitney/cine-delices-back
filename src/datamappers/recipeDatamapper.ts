import { client } from "../database/client";
import type { Recipe }  from "../types/types";
import type { Difficulty } from "../types/types";
import type { Cost } from "../types/types";
import type { Category } from "../types/types";
import type { Quantity } from "../types/types";
import type { Media } from "../types/types";

const recipeDatamapper = {
    async getRecipeById(id: number): Promise<Recipe>{
        const query = `SELECT * FROM "recipe" WHERE id = $1`;
        const values = [id];
        const result = await client.query<Recipe>(query, values);
        return result.rows[0];
    },

    async getAllRecipes(): Promise<Recipe[]> {
        const query = 'SELECT * FROM recipe WHERE status= true';
        const result = await client.query<Recipe>(query);
        return result.rows;
    },

    async getAllRecipeByCategory(categoryId: number): Promise<Recipe[]> {
        const query = `SELECT * FROM recipe WHERE id IN (
                          SELECT recipe_id FROM category WHERE id = $1 AND status= true
                       )`;
        const values = [categoryId];
        const result = await client.query<Recipe>(query, values);
        return result.rows;
    },
    
    async createRecipe(data: {
        title: string;
        image: string;
        description: string;
        instruction: string;
        duration: string;
        difficulty: Difficulty;
        cost: Cost;
        categories?: Category[];
        ingredients?: Quantity[];
        media?: Media[];
    }): Promise<Recipe> {
        const query = {
            text: `INSERT INTO recipe (title, image, description, instruction, duration, difficulty, cost, categories, ingredients, media, updated_at) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
                   RETURNING *;`,
            values: [
                data.title,
                data.image,
                data.description,
                data.instruction,
                data.duration,
                data.difficulty,
                data.cost,
                data.categories || [],
                data.ingredients || [],
                data.media || [],
                new Date().toISOString()
            ]
        };
    
        const result = await client.query<Recipe>(query.text, query.values);
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log(result.rows[0]);
        return result.rows[0];
    },

    async updateRecipe(data: {
        id: number;
        title: string;
        image: string;
        description: string;
        instruction: string;
        duration: string;
        difficulty: Difficulty;
        cost: Cost;
        categories?: Category[];
        ingredients?: Quantity[];
        media?: Media[];
    }): Promise<Recipe> {
        const query = {
            text: `UPDATE recipe 
                   SET title=$1, image=$2, description=$3, instruction=$4, duration=$5, 
                       difficulty=$6, cost=$7, categories=$8, ingredients=$9, media=$10, 
                       updated_at=$11 
                   WHERE id=$12 
                   RETURNING *`,
            values: [
                data.id,
                data.title,
                data.image,
                data.description,
                data.instruction,
                data.duration,
                data.difficulty,
                data.cost,
                data.categories || [],
                data.ingredients || [],
                data.media || [],
                new Date().toISOString(),
                data.id
            ]
        };
    
        const result = await client.query<Recipe>(query.text, query.values);
        return result.rows[0];
    },

    async removeRecipe(id: number): Promise<Recipe> {
        const query = 'DELETE FROM recipe WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await client.query<Recipe>(query, values);
        return result.rows[0];
    }

}

export default recipeDatamapper;