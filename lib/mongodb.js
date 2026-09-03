import { MongoClient } from "mongodb";

export async function getDatabase() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGO_PUBLIC_URL;
  if (!uri) throw new Error("MongoDB não configurado. Defina MONGODB_URI (ou MONGO_URL) no ambiente da aplicação.");
  if (!global._mongoClientPromise) global._mongoClientPromise = new MongoClient(uri).connect();
  const client = await global._mongoClientPromise;
  return client.db(process.env.MONGODB_DB || "formatura");
}
