import { Role } from "@prisma/client";

interface IClienteDto {
    id: number;
    nomeCompleto: string;
    contato: string;
    endereco: string;
}

export interface IUserRequest {
    id: number;
    name: string;
    email: string;
    emailConfirm?: boolean;
    cliente?: IClienteDto | null;
    type: Role;
}