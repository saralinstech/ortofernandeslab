import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

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

function wantsInsecureConnection(url: string) {
  return /(?:\?|&)sslmode=disable(?:&|$)/i.test(url);
}

// No runtime do Cloudflare Workers (usado pelo `vinext dev` local), um socket TCP
// aberto numa requisição não pode ser reaproveitado em outra — dá "Cannot perform
// I/O on behalf of a different request". Em Node.js (produção na Vercel) isso não
// existe, e cachear a conexão entre chamadas é o comportamento certo.
const isWorkersRuntime = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

function createDb() {
  const url = databaseUrl();
  const ssl = process.env.DATABASE_SSL?.toLowerCase() === "disable" || wantsInsecureConnection(url)
    ? false
    : "require";
  const max = Math.max(1, Math.min(10, Number(process.env.DATABASE_POOL_MAX || 5)));

  const client = postgres(url, {
    ssl,
    max,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });
  return drizzle(client, { schema });
}

export function getDb() {
  if (isWorkersRuntime) return createDb();
  if (!database) database = createDb();
  return database;
}
