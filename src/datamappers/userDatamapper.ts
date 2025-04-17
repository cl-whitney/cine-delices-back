import { client } from "../database/client";
import type { User }  from "../types/types";

const userDatamapper = {
    async getUserById(id: number): Promise<User>{
        const query = `SELECT * FROM "user" WHERE id = $1 AND status = true`;
        const values = [id];
        const result = await client.query<User>(query, values)
        return result.rows[0]
    },

    async getAllUsers(): Promise<User[]> {
            const query = 'SELECT * FROM "user" WHERE status = true';
            const result = await client.query<User>(query);
            return result.rows;
        },

    async updateUser(data: {
            id: number;
            first_name: string;
            last_name: string;
            updated_at?: Date;
        }): Promise<User> {
            const query = {
                text: `UPDATE "user" 
                       SET first_name=$1, last_name=$2, updated_at=$3 
                       WHERE id=$4
                       RETURNING *`,
                       values: [
                        data.id,
                        data.first_name,
                        data.last_name,
                        new Date().toISOString()
                    ]
            };
        
            const result = await client.query<User>(query.text, query.values);
            return result.rows[0];
        },

    async getUserByEmail(email: string): Promise<User>{
        const query = 'SELECT * FROM "user" WHERE email = $1 AND WHERE status = true';
        const values = [email];
        const result = await client.query<User>(query, values)

        return result.rows[0]
    },
    
    async createUser(data: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
    }): Promise<User>{
        const query = {
            text: `INSERT INTO "user" (first_name, last_name, email, password) 
                   VALUES ($1, $2, $3, $4) 
                   RETURNING *;`,
            values: [
                    data.first_name,
                    data.last_name,
                    data.email,
                    data.password,
                ],
    };
    const result = await client.query<User>(query);
    return result.rows[0];
    
    },    

    async removeUser(id: number): Promise<User | null> {
        const query = {
          text: `
            UPDATE "user"
            SET status     = $1,
                updated_at = $2
            WHERE id = $3
            RETURNING *
          `,
          values: [
            false,
            new Date().toISOString(),      
            id
          ]
        };
      
        const result = await client.query<User>(query);

        return result.rows[0];
      }

}

export default userDatamapper;