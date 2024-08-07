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

    getUserById: async (id: number): Promise<User | null> => {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    },

    getUserByEmail: async (email: string): Promise<User | null> => {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        return user;
    },

    getAllUsers: async (): Promise<User[]> => {
        const users = await prisma.user.findMany();
        return users;
    },
};
