import express from 'express';
import 'dotenv/config';
import { join } from 'node:path';
import cors from 'cors';
import type { } from 'express'
import type { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import { errorHandler } from './middlewares/errrosHandlers/handlers';
import notFound from './middlewares/errrosHandlers/notFound';
import initUserSession from './middlewares/initAdminSession';
import router from './routers/router';


const app = express();

// Branchement du template engine EJS
app.set('view engine', 'ejs');
// Définition du dossier contenant les fichiers EJS
app.set('views', join(__dirname, '/views'));
// Définition du dossier contenant les fichiers statiques (CSS, JS, images...)
app.use(express.static(join(__dirname, 'public')));

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.locals.page = null; // Initialisation de la variable
  next();
});
// app.use((_req: Request, res: Response, next: NextFunction) => {
//   res.locals.admin = null; // Initialisation de la variable
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    credentials: true
  }),
);
// Paramètre de session
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  // si true sesssion enregistrée en bdd à chaque requête
  resave: false, 
  saveUninitialized: false,
  cookie: {
    // a passer en true en https et en prod
    secure: false, 
    maxAge: 1000*60*60,
    // rend inaccessible depuis JS côté client (protection contre les attaques XSS)
    httpOnly: true, 
  }

}));

// Initialiser la session Admin
app.use(initUserSession);

app.get(
  '/',
  (_req: Request, res: Response, _next: NextFunction) => {
    res.redirect('/admin/connexion');
  }
);


// Branchement du router
app.use(router);

// notfound middleware
app.use(notFound);
// errorHandlers
app.use(errorHandler);

// Lancement du server
const port = process.env.PORT || 3000;
const base_url = process.env.BASE_URL || 'http://localhost';

app.listen(port, () => {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log(`Listening on ${base_url}:${port}`);
});

export default app;