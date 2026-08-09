import path from 'path';
import app from './app';
import dotenv from 'dotenv';
import { connectDb } from './utils/db';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const port = process.env.PORT || 4000;

const startServer = async () => {
  console.log('Using env file:', envPath);
  console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL ? '[REDACTED]' : 'undefined');
  
  const dbReady = await connectDb();
  
  if (dbReady) {
    console.log('✅ Database connected successfully');
  }
  
  app.listen(port, () => {
    console.log(`PINAKK API server listening on port ${port}`);
  });
};

startServer();
