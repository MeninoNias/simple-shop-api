import { Decimal } from '@prisma/client/runtime/library';
import { ICliente as Cliente } from './Cliente';
import { ItemPedido } from './ItemPedido';
import { PedidoStatus } from '@prisma/client';

export interface IPedido {
    id: number;
    clienteId: number;
    status: PedidoStatus;
    dataPedido: Date;
    total: Decimal;
    cliente?: Cliente;
    ItemPedido?: ItemPedido[];
}