import { ClienteCreateSchema, ClienteUpdateSchema } from '../schemas/clientes';
import prisma from '../database';
import { ICliente as Cliente } from '../database/models/Cliente';
import { PasswordCrypto } from '../shared/services';
import { Role } from '@prisma/client';
import { IClienteDto } from '../database/dto/ClienteDto';
import { IClienteDetailDto } from '../database/dto/ClienteDetail';

export const clienteService = {
    createCliente: async (data: ClienteCreateSchema): Promise<IClienteDto> => {
        const hashedPassword = await PasswordCrypto.hashPassword(data.password);

        const newCliente = await prisma.cliente.create({
            data: {
                nomeCompleto: data.nome,
                contato: data.contato,
                endereco: data.endereco,
                user: {
                    create: {
                        name: data.nome,
                        email: data.email,
                        password: hashedPassword,
                        type: Role.CLIENT
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        type: true
                    }
                }
            },
        });


        return newCliente;
    },

    getClienteById: async (id: number): Promise<Omit<Cliente, 'userId' | 'user' | 'status'> | null> => {
        const cliente = await prisma.cliente.findUnique({
            where: {
                id: Number(id),
                status: true
            },
            select: {
                id: true,
                nomeCompleto: true,
                contato: true,
                endereco: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return cliente;
    },

    getClienteDetailByUser: async (id: number): Promise<IClienteDetailDto | null> => {
        const cliente = await prisma.cliente.findUnique({
            where: {
                userId: Number(id),
                status: true
            },
            select: {
                id: true,
                nomeCompleto: true,
                contato: true,
                endereco: true,
                status: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        type: true,
                    }
                },
                pedidos: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return cliente;
    },

    deleteClienteById: async (id: number): Promise<Omit<Cliente, 'userId' | 'user'> | null> => {
        const deleteCliente = await prisma.$transaction(async (prisma) => {
            const cliente = await prisma.cliente.delete({
                where: { id: Number(id) },
            });
            await prisma.user.delete({
                where: { id: cliente.userId },
            });
            return cliente
        })
        return deleteCliente;
    },

    updateCliente: async (id: number, data: ClienteUpdateSchema): Promise<Omit<Cliente, 'userId' | 'user' | 'status'> | null> => {
        const updateCliente = await prisma.cliente.update({
            where: { id: Number(id) },
            data: {
                nomeCompleto: data.nome,
                contato: data.contato,
                endereco: data.endereco,
                user: {
                    update: {
                        name: data.nome,
                        email: data.email,
                    }
                }
            },
            select: {
                id: true,
                nomeCompleto: true,
                contato: true,
                endereco: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        type: true
                    }
                }
            }
        });
        return updateCliente;
    },

    getAllClientes: async (): Promise<Omit<Cliente, 'userId' | 'user'>[]> => {
        const clientes = await prisma.cliente.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        type: true
                    }
                }
            },
        });
        return clientes;
    },
};
