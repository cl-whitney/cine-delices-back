import { client } from "../database/client";
import type { Category } from "../types/types";

const categoryDatamapper = {
    async getRecipeById(id: number): Promise<Category>{
        const query = `SELECT * FROM "category" WHERE id = $1 WHERE status= true`;
        const values = [id];
        const result = await client.query<Category>(query, values);
        return result.rows[0];
    },

    async getAllCategorys(): Promise<Category[]> {
        const query = 'SELECT * FROM category WHERE status=true';
        const result = await client.query<Category>(query);
        return result.rows;
    },
    
    async createCategory(data: {
        id: number;
        name: string;
        updated_at?: Date;
    }): Promise<Category> {
        const query = {
            text: `INSERT INTO Category (name, updated_at) 
                   VALUES ($1, $2) 
                   RETURNING *;`,
            values: [
                data.id,
                data.name,
                new Date().toISOString()
            ]
        };
    
        const result = await client.query<Category>(query.text, query.values);
        return result.rows[0];
    },

    async updateCategory(data: {
        id: number;
        name: string;
        updated_at?: Date;
    }): Promise<Category> {
        const query = {
            text: `UPDATE Category 
                   SET name=$1, updated_at=$2 
                   WHERE id=$3
                   RETURNING *`,
                   values: [
                    data.id,
                    data.name,
                    new Date().toISOString()
                ]
        };
    
        const result = await client.query<Category>(query.text, query.values);
        return result.rows[0];
    },

    async removeCategory(id: number): Promise<Category> {
        const query = 'DELETE FROM Category WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await client.query<Category>(query, values);
        return result.rows[0];
    }

}

export default categoryDatamapper;