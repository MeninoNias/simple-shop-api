import { IPedido as Pedido } from "./Pedido";
import { IUser as User } from "./User";

export interface ICliente {
    id: number;
    userId: number;
    nomeCompleto: string;
    contato: string;
    endereco: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    pedidos?: Pedido[];
    user: User;
}