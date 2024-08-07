import { ICliente as Cliente } from "./Cliente";

export interface IUser {
    id: number;
    name: string;
    email: string;
    emailConfirm: boolean;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    cliente?: Cliente;
    type: Role;
}

export enum Role {
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN',
}