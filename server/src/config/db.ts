import mongoose from 'mongoose';
import { env } from './env';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function connectDB(): Promise<void> {
  mongoose.set('strictQuery', true);

  // Fail fast on server selection so retries kick in quickly instead of
  // hanging on the default 30s timeout.
  const options: mongoose.ConnectOptions = {
    serverSelectionTimeoutMS: 10000,
  };

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await mongoose.connect(env.MONGO_URI, options);
      console.log('[db] MongoDB connected');
      return;
    } catch (err) {
      lastError = err;
      console.error(
        `[db] Connection attempt ${attempt}/${MAX_RETRIES} failed: ${(err as Error).message}`
      );
      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS);
      }
    }
  }

  console.error(
    '[db] Could not connect to MongoDB after multiple attempts.\n' +
      '     A "querySrv ENOTFOUND" error means the Atlas SRV record could not be resolved.\n' +
      '     Check that MONGO_URI is correct and the cluster is active (free clusters auto-pause),\n' +
      '     or use the non-SRV "mongodb://host1,host2,host3/db" connection string.'
  );
  throw lastError;
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
