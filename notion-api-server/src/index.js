import express from 'express';
import dotenv from 'dotenv';
import notionRoutes from './routes/notion/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/notion', notionRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});