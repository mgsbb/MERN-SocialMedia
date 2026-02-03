import 'dotenv/config';

export const env = {
    PORT: Number(process.env.PORT ?? 3000),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    MONGO_URI: requireEnv('MONGO_URI'),
    JWT_SECRET: requireEnv('JWT_SECRET'),
};

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        console.error(`Missing required environment variable: ${name}`);
        process.exit(1);
    }

    return value;
}
