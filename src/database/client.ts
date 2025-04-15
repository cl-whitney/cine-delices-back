import pg from 'pg';

// récupération des infos dans le fichier .env
const client = new pg.Client(process.env.PG_URL);

async function connectToDb() {
  await client.connect();
}

connectToDb();

export {client};