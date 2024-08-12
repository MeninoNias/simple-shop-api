import { IPedido } from "../models/Pedido";

export interface IUserDto {
    id: number;
    email: string;
    type: string
}

export interface IClienteDto {
    id: number;
    nomeCompleto: string;
    contato: string;
    endereco: string;
    createdAt: Date;
    updatedAt: Date;
    pedidos?: IPedido[];
    user?: IUserDto;
}