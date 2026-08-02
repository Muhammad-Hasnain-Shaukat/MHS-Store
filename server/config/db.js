import mongoose from "mongoose";

// Cache the connection across serverless function invocations so we don't
// open a new MongoDB connection on every request (Vercel reuses warm instances).
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongooseInstance) => {
      console.log(`MongoDB connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
