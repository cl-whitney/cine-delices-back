import { client } from "../database/client";
import type { Media } from "../types/types";

const mediaDatamapper = {
    async getMediaById(id: number): Promise<Media> {
      const query = `
        SELECT * FROM media WHERE id = $1 AND status = true`;
      const values = [id];
      const result = await client.query<Media>(query, values);
      return result.rows[0];
    },
  
    async getAllMedias(): Promise<Media[]> {
      const query = `
        SELECT * FROM media WHERE status = true`;
      const result = await client.query<Media>(query);
      return result.rows;
    },
  
    async getAllMediasByRecipe(recipeId: number): Promise<Media[]> {
      const query = `
        SELECT * FROM media WHERE recipe_id = $1 AND status = true`;
      const values = [recipeId];
      const result = await client.query<Media>(query, values);
      return result.rows;
    },
  
    async createMedia(data: {
      title: string;
      type: string;
      description?: string | null;
      label?: string | null;
      recipeId: number;
      status?: boolean;
    }): Promise<Media> {
      const query = {
        text: `
          INSERT INTO media
            (title, type, description, label, recipe_id, status, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
          RETURNING *
        `,
        values: [
          data.title,
          data.type,
          data.description ?? null,
          data.label ?? null,
          data.recipeId,
          data.status ?? true,
        ],
      };
  
      const result = await client.query<Media>(query.text, query.values);
      return result.rows[0];
    },
  
    async updateMedia(data: {
      id: number;
      title: string;
      type: string;
      description?: string | null;
      label?: string | null;
      recipeId: number;
      status: boolean;
    }): Promise<Media> {
      const query = {
        text: `
          UPDATE media
          SET title = $1, type = $2, description = $3, label = $4, recipe_id = $5, status = $6,
          updated_at =$7
          WHERE id = $8
          RETURNING *
        `,
        values: [
          data.title,
          data.type,
          data.description ?? null,
          data.label ?? null,
          data.recipeId,
          data.status,
          data.id,
          new Date().toISOString()
        ],
      };
  
      const result = await client.query<Media>(query.text, query.values);
      return result.rows[0];
    },
  
    async removeMedia(id: number): Promise<Media> {
      const query = `
        DELETE FROM media
        WHERE id = $1
        RETURNING *
      `;
      const values = [id];
      const result = await client.query<Media>(query, values);
      return result.rows[0];
    },
  };
  
  export default mediaDatamapper