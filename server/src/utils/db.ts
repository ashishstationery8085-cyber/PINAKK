import mongoose from 'mongoose';

export const isDbConnected = () => mongoose.connection.readyState === 1;

const connectDb = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/pinakk';
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not set. Falling back to local MongoDB at mongodb://localhost:27017/pinakk');
  } else {
    console.log('Connecting to MongoDB with URI:', uri.startsWith('mongodb+srv://') ? 'mongodb+srv://[REDACTED]' : uri);
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    console.warn('Continuing without MongoDB. API routes that need persistent data will return 503 until a database is available.');
    return false;
  }
};

export default connectDb;
