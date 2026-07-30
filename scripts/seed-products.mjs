// Carga inicial do catálogo. Rode UMA vez, após a migração, num banco vazio.
// É idempotente: nunca insere um produto cujo nome já exista na tabela.
// O catálogo de app/catalog.ts é a semente inicial; depois disso o banco é a fonte da verdade.
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

// catalog.ts é TypeScript; lemos as tuplas direto do fonte para não depender de build.
const source = await readFile(new URL("../app/catalog.ts", import.meta.url), "utf8");
const descBlock = source.match(/const desc:Record<string,string>=(\{[\s\S]*?\});/);
const descriptions = descBlock ? JSON.parse(descBlock[1]) : {};
const rows = [...source.matchAll(/\[(\d+),"([^"]+)","([^"]+)",(\d+(?:\.\d+)?)\]/g)].map(
  ([, , name, category, price]) => ({
    name,
    category,
    price: Number(price),
    description: descriptions[category] ?? "",
  }),
);

if (!rows.length) {
  console.error("Nenhum produto encontrado em app/catalog.ts.");
  process.exit(1);
}

const urlDisablesSsl = /(?:\?|&)sslmode=disable(?:&|$)/i.test(databaseUrl);
const ssl = process.env.DATABASE_SSL?.toLowerCase() === "disable" || urlDisablesSsl
  ? false
  : "require";
const sql = postgres(databaseUrl, { ssl, max: 1, prepare: false });

try {
  const existing = new Set((await sql`SELECT name FROM products`).map((row) => row.name));
  const novos = rows.filter((row) => !existing.has(row.name));

  if (!novos.length) {
    console.log(`Nada a fazer: os ${rows.length} produtos do catálogo já estão no banco.`);
  } else {
    await sql`INSERT INTO products ${sql(novos, "name", "category", "price", "description")}`;
    console.log(`${novos.length} produto(s) inserido(s), ${rows.length - novos.length} já existiam.`);
  }

  const [{ total, ativos }] = await sql`
    SELECT count(*)::int AS total, count(*) FILTER (WHERE active)::int AS ativos FROM products
  `;
  console.log(`Banco: ${total} produto(s), ${ativos} ativo(s).`);
} finally {
  await sql.end();
}
