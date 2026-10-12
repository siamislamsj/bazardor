import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing in .env");
}

const globalForMongo = globalThis;

if (!globalForMongo.bazardorMongoClientPromise) {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  globalForMongo.bazardorMongoClientPromise = client.connect().catch((error) => {
    globalForMongo.bazardorMongoClientPromise = undefined;
    throw error;
  });
}

const client = await globalForMongo.bazardorMongoClientPromise;

const db = client.db("bazardor");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});