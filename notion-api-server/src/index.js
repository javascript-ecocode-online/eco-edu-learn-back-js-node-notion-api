import express from 'express';
import dotenv from 'dotenv';
import notionRoutes from './modules/notion/routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); // phải có dòng này trước khi các route được dùng
app.use('/api/notion', notionRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});