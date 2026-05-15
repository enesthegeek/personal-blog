import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import postsRouter from './routes/posts.js';
import uploadRouter from './routes/upload.js';
import authRouter from './routes/auth.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => res.json({ message: 'Personal Blog API is running' }));

app.use('/api/auth',   authRouter);
app.use('/api/posts',  postsRouter);
app.use('/api/upload', uploadRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
