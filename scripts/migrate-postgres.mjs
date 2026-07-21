import { readFile } from "node:fs/promises";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.error("DATABASE_URL não configurada. Preencha .env.local com a URL real do PostgreSQL.");
  process.exit(1);
}

if (!databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("postgresql://")) {
  console.error("DATABASE_URL inválida. Use uma URL começando com postgres:// ou postgresql://.");
  process.exit(1);
}

const urlDisablesSsl = /(?:\?|&)sslmode=disable(?:&|$)/i.test(databaseUrl);
const ssl = process.env.DATABASE_SSL?.toLowerCase() === "disable" || urlDisablesSsl
  ? false
  : "require";
const sql = postgres(databaseUrl, { ssl, max: 1, prepare: false });

try {
  const migration = await readFile(
    new URL("../db/postgres-migrations/0000_initial.sql", import.meta.url),
    "utf8",
  );
  await sql.unsafe(migration);
  console.log("Estrutura PostgreSQL criada com sucesso.");
} finally {
  await sql.end();
}
