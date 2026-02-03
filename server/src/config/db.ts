import mongoose from 'mongoose';
import { env } from './env';

export async function connectDb() {
    if (!env.MONGO_URI) {
        throw new Error('Database url MONGO_URI is not defined in .env');
    }

    try {
        await mongoose.connect(env.MONGO_URI);
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection failed', err);
        process.exit(1);
    }
}
