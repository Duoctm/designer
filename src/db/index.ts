import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as products from "./schema/products";
import * as templates from "./schema/templates";
import * as designs from "./schema/designs";

const connectionString = process.env.DATABASE_URL!;

// SSL always required for Supabase
const client = postgres(connectionString, {
  ssl: "require",
  prepare: false, // Required for Supabase transaction pooler
});

export const db = drizzle(client, {
  schema: {
    ...products,
    ...templates,
    ...designs,
  },
});
