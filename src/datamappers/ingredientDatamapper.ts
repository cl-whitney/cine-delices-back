import { client } from "../database/client";
import type { Ingredient }  from "../types/types";

const ingredientDatamapper = {
    async getIngredientById(id: number): Promise<Ingredient>{
        const query = `SELECT * FROM "ingredient" WHERE id = $1`;
        const values = [id];
        const result = await client.query<Ingredient>(query, values);
        return result.rows[0];
    },
    
    async createIngredient(data: {
        name: string,
        unity: string
    }): Promise<Ingredient> {
        const query = {
            text: `INSERT INTO ingredient (name, unity) 
                   VALUES ($1, $2) 
                   RETURNING *;`,
            values: [
                data.name,
                data.unity
            ]
        };
    
        const result = await client.query<Ingredient>(query.text, query.values);
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log(result.rows[0]);
        return result.rows[0];
    },

    async updateIngredient(data: {
        name: string,
        unity: string
    }): Promise<Ingredient> {
        const query = {
            text: `UPDATE Ingredient 
                   SET name=$1, unity=$2 
                       updated_at=$3
                   WHERE id=$12 
                   RETURNING *;`,
                   values: [
                    data.name,
                    data.unity,
                    new Date().toISOString(),
                ]
        };
    
        const result = await client.query<Ingredient>(query.text, query.values);
        return result.rows[0];
    },

    async removeIngredient(id: number): Promise<Ingredient> {
        const query = 'DELETE FROM ingredient WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await client.query<Ingredient>(query, values);
        return result.rows[0];
    }

}

export default ingredientDatamapper;