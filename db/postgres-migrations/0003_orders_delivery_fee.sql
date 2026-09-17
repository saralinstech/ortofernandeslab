-- Taxa de entrega do pedido, em reais, lançada manualmente conforme o endereço do cliente.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee double precision NOT NULL DEFAULT 0;
