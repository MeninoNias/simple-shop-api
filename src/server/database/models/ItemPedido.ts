import { IProduto as Produto } from './Produto';
import { IPedido as Pedido } from './Pedido';
import { Decimal } from '@prisma/client/runtime/library';

export interface ItemPedido {
    id: number;
    pedidoId: number;
    produtoId: number;
    quantidade: number;
    precoUnitario: Decimal;
    subtotal: Decimal;
    pedido?: Pedido;
    produto?: Produto;
}