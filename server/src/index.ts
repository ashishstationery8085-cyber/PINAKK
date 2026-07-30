import path from 'path';
import app from './app';
import dotenv from 'dotenv';
import connectDb from './utils/db';
import { seedDemoData } from './utils/seedDemoData';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const port = process.env.PORT || 4000;

const startServer = async () => {
  console.log('Using env file:', envPath);
  console.log('Loaded MONGO_URI:', process.env.MONGO_URI ? '[REDACTED]' : 'undefined');
  const dbReady = await connectDb();
  const seedResult = await seedDemoData();
  console.log('Database ready:', dbReady);
  console.log('Demo seed result:', seedResult);
  app.listen(port, () => {
    console.log(`PINAKK API server listening on port ${port}`);
  });
};

startServer();
