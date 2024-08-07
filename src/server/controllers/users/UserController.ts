/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { validation } from '../../shared/middleware/Validation';

import { userService } from "../../service/userService";
import { UserSchema, userSchema } from "../../schemas/users/userSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "../../shared/exception/PrismaParseError";


export const createUserValidation = validation((getSchema) => ({
    body: getSchema<UserSchema>(userSchema),
}));

export const createUser = async (request: Request<{}, {}, UserSchema>, response: Response, next: NextFunction) => {
    try {
        const data = request.body
        const newUser = await userService.createUser(data);
        return response.status(StatusCodes.CREATED).json(newUser);

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        } else {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
};

export const getAllUsers = async (request: Request, response: Response) => {
    try {
        const users = await userService.getAllUsers();
        return response.status(StatusCodes.OK).json({ users: users });
    } catch (error) {
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        } else {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
};
