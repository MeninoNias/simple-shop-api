import { Decimal } from '@prisma/client/runtime/library';
import { ICliente as Cliente } from './Cliente';
import { ItemPedido } from './ItemPedido';

export interface IPedido {
    id: number;
    clienteId: number;
    status: PedidoStatus;
    dataPedido: Date;
    total: Decimal;
    cliente: Cliente;
    ItemPedido: ItemPedido[];
}

export enum PedidoStatus {
    RECEBIDO = 'RECEBIDO',
    EM_PREPARACAO = 'EM_PREPARACAO',
    DESPACHADO = 'DESPACHADO',
    ENTREGUE = 'ENTREGUE'
}