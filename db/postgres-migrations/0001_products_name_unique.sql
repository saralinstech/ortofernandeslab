-- Impede que o catálogo seja semeado duas vezes.
-- A duplicação anterior (42 produtos repetidos) veio de duas requisições
-- simultâneas rodando o seed com a tabela ainda vazia; sem uma trava no banco,
-- ambas leram "0 linhas" e ambas inseriram o catálogo inteiro.
--
-- O índice é PARCIAL (só sobre active) de propósito: a limpeza em
-- docs/limpeza-produtos-duplicados.sql desativa as duplicatas em vez de
-- deletá-las, para não quebrar os pedidos antigos que guardam o id do produto
-- em orders.items. Um índice total falharia enquanto essas linhas existirem.
CREATE UNIQUE INDEX IF NOT EXISTS products_name_unique_active
  ON products (name) WHERE active;
