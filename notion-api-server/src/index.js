import express from 'express';
import dotenv from 'dotenv';
import notionRoutes from './modules/notion/routes.js';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import path from 'path';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Load SSL certificate (local self-signed)
const sslOptions = {
  key: fs.readFileSync(path.resolve('ssl/key.pem')),
  cert: fs.readFileSync(path.resolve('ssl/cert.pem')),
};

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // middleware xử lý body JSON

// Route chính
app.use('/api/notion', notionRoutes);

// Tạo HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS server is running at https://localhost:${PORT}`);
});