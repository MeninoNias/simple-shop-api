-- DropForeignKey
ALTER TABLE "item_pedidos" DROP CONSTRAINT "item_pedidos_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "item_pedidos" DROP CONSTRAINT "item_pedidos_produtoId_fkey";

-- AddForeignKey
ALTER TABLE "item_pedidos" ADD CONSTRAINT "item_pedidos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedidos" ADD CONSTRAINT "item_pedidos_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
