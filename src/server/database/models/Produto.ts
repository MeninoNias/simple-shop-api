import { Decimal } from '@prisma/client/runtime/library';
import { ItemPedido } from './ItemPedido';

export interface IProduto {
    id: number;
    nome: string;
    descricao: string;
    preco: Decimal;
    quantidadeEmEstoque: number;
    createdAt: Date;
    updatedAt: Date;
    ItemPedido: ItemPedido[];
}