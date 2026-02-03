import { app } from './app';
import { env } from './config/env';
import { connectDb } from './config/db';

async function main() {
    await connectDb();

    app.listen(env.PORT, () => {
        console.log(`Server at http://localhost:${env.PORT}`);
    });
}

main();
