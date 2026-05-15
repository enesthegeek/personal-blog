import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postsRouter from './routes/posts.js';
import uploadRouter from './routes/upload.js';
import authRouter from './routes/auth.js';
import { uploadsDir } from './config.js';

process.on('uncaughtException', (err) => { process.stdout.write(`CRASH uncaughtException: ${err.stack}\n`); process.exit(1); });
process.on('unhandledRejection', (reason) => { process.stdout.write(`CRASH unhandledRejection: ${reason}\n`); process.exit(1); });

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => res.json({ message: 'Personal Blog API is running' }));

app.use('/api/auth',   authRouter);
app.use('/api/posts',  postsRouter);
app.use('/api/upload', uploadRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
