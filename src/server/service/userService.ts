import { IUser as User } from '../database/models/User';
import { UserCreateSchema, UserUpdateSchema } from '../schemas/users';
import prisma from '../database';
import { Role } from '@prisma/client';
import { PasswordCrypto } from '../shared/services';
import { IUserRequest } from 'server/database/dto/UserRequest';

export const userService = {
    createUser: async (data: UserCreateSchema): Promise<Omit<User, 'password'>> => {
        const hashedPassword = await PasswordCrypto.hashPassword(data.password);
        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                type: Role.ADMIN,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                type: true
            }
        });
        return user;
    },

    getUserById: async (id: number): Promise<Omit<User, 'password'> | null> => {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
                emailConfirm: true,
                createdAt: true,
                updatedAt: true,
                type: true,
            }
        });
        return user;
    },

    getUserClienteById: async (id: number): Promise<IUserRequest | null> => {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
                emailConfirm: true,
                type: true,
                cliente: {
                    select: {
                        id: true,
                        nomeCompleto: true,
                        contato: true,
                        endereco: true
                    }
                }
            }
        });
        return user;
    },

    getUserByEmail: async (email: string): Promise<User | null> => {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        return user;
    },

    deleteById: async (id: number): Promise<User | null> => {
        const deleteUser = await prisma.user.delete({
            where: { id: Number(id) },
        });
        return deleteUser;
    },

    updateUser: async (id: number, user: UserUpdateSchema): Promise<Omit<User, 'password'> | null> => {
        const updateUser = await prisma.user.update({
            where: { id: Number(id) },
            data: user,
            select: {
                id: true,
                name: true,
                email: true,
                emailConfirm: true,
                createdAt: true,
                updatedAt: true,
                type: true
            }
        });
        return updateUser;
    },

    getAllUsers: async (): Promise<Omit<User, 'password'>[]> => {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                emailConfirm: true,
                createdAt: true,
                updatedAt: true,
                type: true
            }
        });
        return users;
    },
};
