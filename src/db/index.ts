import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as products from "./schema/products";
import * as templates from "./schema/templates";
import * as designs from "./schema/designs";

const connectionString = process.env.DATABASE_URL!;

// SSL required for Supabase connections
const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
  prepare: false, // Required for Supabase transaction pooler
});

export const db = drizzle(client, {
  schema: {
    ...products,
    ...templates,
    ...designs,
  },
});
