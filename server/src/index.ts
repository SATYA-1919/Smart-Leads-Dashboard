import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  // Bind the port first so the platform detects an open port even while the
  // database connection is still being established/retried.
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`[server] Listening on http://localhost:${env.PORT}`);
    console.log(`[server] Environment: ${env.NODE_ENV}`);
  });

  try {
    await connectDB();
  } catch (err) {
    console.error('[fatal] Database connection failed after retries', err);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error('[fatal] Failed to start server', err);
  process.exit(1);
});
