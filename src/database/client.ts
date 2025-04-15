import pg from 'pg';

// récupération des infos dans le fichier .env
const client = new pg.Client(process.env.PG_URL);

await client.connect();

export {client};