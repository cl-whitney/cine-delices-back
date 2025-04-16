import { client } from "../database/client";
import type { User } from "../types/types";

const adminDatamapper = {
    async getAdminByEmail(email: string): Promise<User>{
        const query = 'SELECT * FROM "user" WHERE email = $1 AND role = $2';
        const values = [email, 'admin'];
        const result = await client.query<User>(query, values)

        return result.rows[0]
    }
};

export default adminDatamapper;