import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const isDbConnected = () => prisma.$isConnected;

export const connectDb = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to MySQL database successfully');
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', (error as Error).message);
    console.error('❌ MySQL connection is REQUIRED for production. Server cannot start without database.');
    process.exit(1);
  }
};

export default prisma;
