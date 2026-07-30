// Remove as duplicatas de produtos criadas pelo seed antigo.
//
// Mantém SEMPRE a linha de menor id de cada nome — é a que carrega as edições
// feitas no admin — e desativa as demais. Por padrão desativa (active=false)
// em vez de deletar, porque os pedidos antigos guardam o id do produto no JSON
// de orders.items e um DELETE quebraria essa referência histórica.
//
//   npm run db:produtos:limpar            -> simulação, não altera nada
//   npm run db:produtos:limpar -- --apply -> aplica (desativa as duplicatas)
//   npm run db:produtos:limpar -- --apply --deletar -> apaga de vez
import postgres from "postgres";

const apply = process.argv.includes("--apply");
const deletar = process.argv.includes("--deletar");

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

const money = (n) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

try {
  const antes = await sql`
    SELECT count(*)::int AS total, count(*) FILTER (WHERE active)::int AS ativos FROM products
  `;
  console.log(`Antes: ${antes[0].total} produto(s), ${antes[0].ativos} ativo(s).\n`);

  // Duplicata = existe outra linha com o mesmo nome e id menor.
  const duplicadas = await sql`
    SELECT p.id, p.name, p.price, p.active,
           (SELECT min(a.id) FROM products a WHERE a.name = p.name) AS mantido_id
    FROM products p
    WHERE EXISTS (SELECT 1 FROM products a WHERE a.name = p.name AND a.id < p.id)
    ORDER BY p.id
  `;

  if (!duplicadas.length) {
    console.log("Nenhuma duplicata encontrada. Banco já está limpo.");
    process.exit(0);
  }

  console.log(`${duplicadas.length} duplicata(s) encontrada(s):\n`);
  for (const d of duplicadas) {
    const mantido = await sql`SELECT price FROM products WHERE id = ${d.mantido_id}`;
    const alerta = Number(mantido[0].price) !== Number(d.price) ? "   <- preços diferentes" : "";
    console.log(
      `  remover id ${String(d.id).padStart(3)} ${money(d.price).padStart(11)}` +
      `  |  manter id ${String(d.mantido_id).padStart(3)} ${money(mantido[0].price).padStart(11)}` +
      `  ${d.name}${alerta}`,
    );
  }

  if (!apply) {
    console.log(`\nSimulação — nada foi alterado.`);
    console.log(`Para aplicar:  npm run db:produtos:limpar -- --apply`);
    process.exit(0);
  }

  const ids = duplicadas.map((d) => d.id);

  if (deletar) {
    const presos = await sql`
      SELECT id FROM orders WHERE items ~ ${`"id":(${ids.join("|")})[,}]`}
    `;
    if (presos.length) {
      console.error(
        `\nAbortado: ${presos.length} pedido(s) referenciam esses produtos ` +
        `(ids ${presos.map((o) => o.id).join(", ")}). Rode sem --deletar para apenas desativar.`,
      );
      process.exit(1);
    }
    await sql`DELETE FROM products WHERE id = ANY(${ids})`;
    console.log(`\n${ids.length} produto(s) deletado(s).`);
  } else {
    await sql`
      UPDATE products SET active = false, public_visible = false WHERE id = ANY(${ids})
    `;
    console.log(`\n${ids.length} produto(s) desativado(s).`);
  }

  const depois = await sql`
    SELECT count(*)::int AS total, count(*) FILTER (WHERE active)::int AS ativos FROM products
  `;
  console.log(`Depois: ${depois[0].total} produto(s), ${depois[0].ativos} ativo(s).`);

  const repetidos = await sql`
    SELECT name, count(*)::int AS n FROM products WHERE active GROUP BY name HAVING count(*) > 1
  `;
  console.log(
    repetidos.length
      ? `ATENÇÃO: ainda há ${repetidos.length} nome(s) repetido(s) entre os ativos.`
      : "Validado: nenhum nome repetido entre os produtos ativos.",
  );
} catch (error) {
  if (error?.code === "ENOTFOUND" || error?.code === "ECONNREFUSED") {
    console.error(
      `Não foi possível conectar ao PostgreSQL (${error.code}).\n` +
      `Confira o DATABASE_URL em .env.local — ele ainda pode estar com o valor de exemplo.`,
    );
  } else {
    console.error(error?.message ?? error);
  }
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
