import express from 'express';
import dotenv from 'dotenv';
import quizRoutes from './modules/quiz/routes.js';
import notionRoutes from './modules/notion/routes.js';
import exportRoutes from './modules/export/routes.js';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';

dotenv.config();

const app = express();

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

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

app.use(express.json());

// Route chính
app.use('/api/quiz', quizRoutes);

app.use('/api/notion', notionRoutes);
app.use('/api/export', exportRoutes);

// Tạo HTTP server
http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`✅ HTTP server is running at http://localhost:${HTTP_PORT}`);
});

// Tạo HTTPS server
https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
  console.log(`✅ HTTPS server is running at https://localhost:${HTTPS_PORT}`);
});