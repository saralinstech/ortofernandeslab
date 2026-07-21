import { readFile } from "node:fs/promises";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.error("DATABASE_URL não configurada.");
  process.exit(1);
}

const ssl = process.env.DATABASE_SSL?.toLowerCase() === "disable" ? false : "require";
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
