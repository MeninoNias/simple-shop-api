import { IUser as User} from '../database/models/User';
import { UserSchema } from '../schemas/users/userSchema';
import prisma from '../database';
import { Role } from '@prisma/client';

export const userService = {
    createUser: async (data: UserSchema): Promise<User> => {
        const user = await prisma.user.create({
            data: {
                ...data,
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

    getAllUsers: async (): Promise<User[]> => {
        const users = await prisma.user.findMany();
        return users;
    },
};
