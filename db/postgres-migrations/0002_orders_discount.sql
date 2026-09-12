-- Desconto aplicado no pedido, em reais, subtraído do total dos itens.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount double precision NOT NULL DEFAULT 0;
