import express from 'express';
import dotenv from 'dotenv';
import notionRoutes from './routes/notion.js'; // nhớ phần .js

// Load biến môi trường từ .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để xử lý JSON
app.use(express.json());

// Mount route
app.use('/api/notion', notionRoutes);

// Root route (test server)
app.get('/', (req, res) => {
  res.send('Notion API Server is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});