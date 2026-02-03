import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/usersRoutes';
import path from 'path';

export const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

const client_build_path = path.resolve(
    __dirname,
    '../',
    '../',
    'client',
    'dist',
);
const client_index_html = path.resolve(client_build_path, 'index.html');

app.use(express.static(client_build_path));

app.get(/.*/, (_req, res) => {
    res.sendFile(client_index_html);
});
