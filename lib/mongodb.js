import { MongoClient } from "mongodb";

let cached = global._mongoClient;

if (!cached) {
  cached = global._mongoClient = { conn: null, promise: null };
}

export async function connectToDatabase(uri) {
  if (!uri) throw new Error("Please define the MONGODB_URI environment variable.");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = { useNewUrlParser: true, useUnifiedTopology: true };
    cached.promise = MongoClient.connect(uri, opts).then((client) => {
      return {
        client,
        db: client.db(process.env.MONGODB_DB || undefined),
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
