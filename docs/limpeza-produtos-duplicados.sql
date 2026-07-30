-- =====================================================================
-- Limpeza das 42 duplicatas de produtos (banco de produção)
-- =====================================================================
-- CONTEXTO
-- A tabela products tem 86 linhas:
--   ids  1-42  -> catálogo semeado, JÁ COM as edições de preço feitas no admin
--   ids 43-84  -> cópia idêntica do catálogo, com os preços ORIGINAIS
--   ids 85-86  -> produtos cadastrados manualmente ("Expansor de willians",
--                 "Disjuntor hyrax borboleta")
--
-- Causa: a função seed() em app/api/products/route.ts rodava a cada
-- requisição e inseria o catálogo inteiro sempre que via a tabela vazia.
-- Duas requisições simultâneas leram "0 linhas" ao mesmo tempo e ambas
-- inseriram os 42 produtos. Já corrigido no código.
--
-- Estratégia: manter SEMPRE a linha de menor id de cada nome (é a que
-- carrega suas edições) e desativar as demais. Não deletamos: pedidos
-- antigos guardam o id do produto no JSON da coluna orders.items, e um
-- DELETE quebraria essa referência histórica.
--
-- Rode os passos na ordem. O 1 e o 2 são apenas leitura.
-- =====================================================================


-- PASSO 1 — Conferir o estado atual (não altera nada)
SELECT count(*) AS total_produtos,
       count(*) FILTER (WHERE active) AS ativos
FROM products;


-- PASSO 2 — Ver exatamente o que será desativado (não altera nada)
-- Confira esta lista antes de seguir. Devem aparecer 42 linhas,
-- todas com id entre 43 e 84.
SELECT id, name, category, price
FROM products p
WHERE EXISTS (
  SELECT 1 FROM products anterior
  WHERE anterior.name = p.name AND anterior.id < p.id
)
ORDER BY id;


-- PASSO 3 — Desativar as duplicatas (mantém a de menor id de cada nome)
BEGIN;

UPDATE products p
SET active = false, public_visible = false
WHERE EXISTS (
  SELECT 1 FROM products anterior
  WHERE anterior.name = p.name AND anterior.id < p.id
);

-- Deve retornar 44 ativos (42 do catálogo + os 2 cadastrados por você).
SELECT count(*) FILTER (WHERE active) AS ativos_apos_limpeza FROM products;

-- Se o número acima estiver certo:
COMMIT;
-- Se algo parecer errado, rode ROLLBACK; no lugar do COMMIT.


-- PASSO 4 — Trava contra reincidência
-- O índice único só pode ser criado depois que os nomes repetidos saírem.
-- Como o PASSO 3 apenas desativa (não deleta), os nomes CONTINUAM repetidos
-- na tabela. Escolha uma das duas opções abaixo:

-- OPÇÃO A (recomendada) — índice único só sobre os produtos ativos.
-- Preserva o histórico de pedidos e ainda impede duplicata nova.
CREATE UNIQUE INDEX IF NOT EXISTS products_name_unique_active
  ON products (name) WHERE active;

-- OPÇÃO B — apagar de vez as duplicatas e usar índice único total.
-- Use apenas se NÃO houver pedidos referenciando os ids 43-84.
-- Para checar antes:
--   SELECT id, items FROM orders WHERE items ~ '"id":(4[3-9]|[5-7][0-9]|8[0-4])\b';
--   Se vier vazio, é seguro:
-- DELETE FROM products p WHERE EXISTS (
--   SELECT 1 FROM products anterior
--   WHERE anterior.name = p.name AND anterior.id < p.id
-- );
-- CREATE UNIQUE INDEX IF NOT EXISTS products_name_unique ON products (name);


-- PASSO 5 — Validação final
SELECT id, name, price FROM products WHERE active ORDER BY id;
-- Confira: 44 linhas, nenhum nome repetido, e os preços editados
-- preservados (ex.: "Hawley com expansor" = 130, "SNS" = 350).
