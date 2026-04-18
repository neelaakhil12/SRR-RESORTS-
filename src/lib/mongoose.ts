import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 10000,
    };

    console.log("📡 Attempting to connect to MongoDB with URI:", process.env.MONGODB_URI?.replace(/:([^@]+)@/, ":****@"));
    
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB Connected Successfully to:", mongooseInstance.connection.name);
      return mongooseInstance;
    }).catch(err => {
      console.error("❌ MongoDB Connection Error Details:");
      console.error("- Message:", err.message);
      console.error("- Code:", err.code);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
