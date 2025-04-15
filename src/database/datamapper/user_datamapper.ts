import type { User }  from "../../types/types";
import { client } from "../client";

const userDatamapper = {
    async getOneUser(id: number): Promise<User>{
        const query = `SELECT * FROM "user" WHERE id = $1`;
        const values = [id];
        const result = await client.query<User>(query, values)
        return result.rows[0]
    },

    async findByEmail(email: string): Promise<User>{
        const query = 'SELECT * FROM "user" WHERE email = $1';
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

    async removeUser(id: number): Promise<User>{
        const query = `DELETE * FROM "user" WHERE id = $1`;
        const values = [id];
        const result = await client.query<User>(query, values)
        return result.rows[0]
    },

}

export default userDatamapper;