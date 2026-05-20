import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  await connectDB();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`[server] Listening on http://localhost:${env.PORT}`);
    console.log(`[server] Environment: ${env.NODE_ENV}`);
  });
}

bootstrap().catch((err) => {
  console.error('[fatal] Failed to start server', err);
  process.exit(1);
});
