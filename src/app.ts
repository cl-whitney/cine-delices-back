import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { join } from 'node:path';
import initUserSession from './middlewares/initAdminSession';
import router from './routers/router';
import notFound from './middlewares/errrosHandlers/notFound';
import { errorHandler } from './middlewares/errrosHandlers/handlers';

const app = express();

// Branchement du template engine EJS
app.set('view engine', 'ejs');
app.set('views', join(__dirname, '/views'));
app.use(express.static(join(__dirname, 'public')));

app.use((_req, res, next) => {
  res.locals.page = null;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    },
  })
);

app.use(initUserSession);
app.use(router);
app.use(notFound);
app.use(errorHandler);

export default app;
