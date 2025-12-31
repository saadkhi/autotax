import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (two levels up from backend/index.js)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const port = process.env.PORT || 5000;

// Connect to MongoDB (non-blocking - server will start even if MongoDB is not available)
connectDB().catch(err => {
  console.error('Initial MongoDB connection failed, but server will continue...');
});

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);

app.listen(port, () => console.log(`server is running on port ${port}`));
