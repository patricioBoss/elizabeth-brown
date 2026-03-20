import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elizabeth-brown';

const connectMongo = async () => {
  mongoose.set('strictQuery', false);
  
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  
  return await mongoose.connect(MONGODB_URI);
};

export default connectMongo;
