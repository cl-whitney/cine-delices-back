import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import session from 'express-session';
import initUserSession from './middlewares/initAdminSession';
import router from './routers/router';

const app = express();

// Liste des URL autorisées
app.use(
  cors({
    origin: [
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
    ],
  }),
);
// Paramètre de session
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false, // si true sesssion enregistrée en bdd à chaque requête
  saveUninitialized: false,
  cookie: {
    secure: false, // a passer en true en https et en prod
    maxAge: 1000*60*60,
    httpOnly: true, // rend inaccessible depuis JS côté client (protection contre les attaques XSS)
  }

}));

app.use(initUserSession);

// Branchement du router
app.use(router);

app.use(express.json());

// Lancement du server

const port = process.env.PORT || 3000;
const base_url = process.env.BASE_URL || 'http://localhost';

app.listen(port, () => {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log(`Listening on ${base_url}:${port}`);
});
