import { User } from '@prisma/client';
import { UserSchema } from '../schemas/userSchema';
import prisma from '../database';

export const userService = {
    createUser: async (data: UserSchema): Promise<User> => {
        const user = await prisma.user.create({
            data,
        });
        return user;
    },

    getUserById: async (id: number): Promise<User | null> => {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    },

    getAllUsers: async (): Promise<User[]> => {
        const users = await prisma.user.findMany();
        return users;
    },
};
