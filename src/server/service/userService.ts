import { IUser as User } from '../database/models/User';
import { UserCreateSchema } from '../schemas/users/userCreateSchema';
import prisma from '../database';
import { Role } from '@prisma/client';
import { PasswordCrypto } from '../shared/services';

export const userService = {
    createUser: async (data: UserCreateSchema): Promise<User> => {
        const hashedPassword = await PasswordCrypto.hashPassword(data.password);
        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                type: Role.ADMIN,
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
                createdAt: true,
                updatedAt: true,
                type: true
            }
        });
        return user;
    },

    getUserByEmail: async (email: string): Promise<Omit<User, 'password'> | null> => {
        const user = await prisma.user.findUnique({
            where: { email: email },
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

    deleteById: async (id: number): Promise<User | null> => {
        const deleteUser = await prisma.user.delete({
            where: { id: Number(id) },
        });
        return deleteUser;
    },
    getAllUsers: async (): Promise<Omit<User, 'password'>[]> => {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                type: true
            }
        });
        return users;
    },
};
