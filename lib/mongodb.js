import { MongoClient } from "mongodb";

export async function getDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Defina a variável de ambiente MONGODB_URI para conectar ao MongoDB.");
  if (!global._mongoClientPromise) global._mongoClientPromise = new MongoClient(uri).connect();
  const client = await global._mongoClientPromise;
  return client.db(process.env.MONGODB_DB || "formatura");
}
