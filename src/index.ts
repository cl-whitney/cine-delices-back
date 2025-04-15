import express from 'express';
import 'dotenv/config';
import cors from 'cors';

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
app.use(express.json());

const port = process.env.PORT || 3000;
const base_url = process.env.BASE_URL || 'http://localhost';

app.listen(port, () => {
  console.log(`Listening on ${base_url}:${port}`);
});
