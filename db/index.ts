import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let client: ReturnType<typeof postgres> | null = null;
let database: ReturnType<typeof drizzle<typeof schema>> | null = null;

function databaseUrl() {
  const value = process.env.DATABASE_URL?.trim();
  if (!value) {
    throw new Error(
      "DATABASE_URL não configurada. Adicione a URL do PostgreSQL da VPS nas variáveis do ambiente.",
    );
  }
  return value;
}

export function getDb() {
  if (database) return database;

  const ssl = process.env.DATABASE_SSL?.toLowerCase() === "disable"
    ? false
    : "require";
  const max = Math.max(1, Math.min(10, Number(process.env.DATABASE_POOL_MAX || 5)));

  client = postgres(databaseUrl(), {
    ssl,
    max,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });
  database = drizzle(client, { schema });
  return database;
}
