import mongoose from 'mongoose';

const connectDb = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/pinakk';
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDb;
