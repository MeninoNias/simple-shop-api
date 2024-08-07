/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { validation } from '../../shared/middleware/Validation';

import { userService } from "../../service/userService";
import { UserCreateSchema, userCreateSchema } from "../../schemas/users/userCreateSchema";
import { userLoginSchema, UserLoginSchema } from "../../schemas/users/userLoginSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "../../shared/exception/PrismaParseError";
import { JWTService, PasswordCrypto } from "../../shared/services";


export const createUserValidation = validation((getSchema) => ({
    body: getSchema<UserCreateSchema>(userCreateSchema),
}));

export const loginUserValidation = validation((getSchema) => ({
    body: getSchema<UserLoginSchema>(userLoginSchema),
}));

export const createUser = async (request: Request<{}, {}, UserCreateSchema>, response: Response, next: NextFunction) => {
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

export const loginUser = async (request: Request<{}, {}, UserLoginSchema>, response: Response) => {
    try {
        const { email, password } = request.body

        const result = await userService.getUserByEmail(email)
        if (!result) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Email ou senha são invalidos.' });
        }

        const passwordMatch = await PasswordCrypto.verifyPassword(password, result.password)

        if (!passwordMatch) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Email ou senha são invalidos.' });
        }
        else {
            const accessToken = JWTService.sign({ uid: result.id });

            if (accessToken === 'JWT_SECRET_NOT_FOUND') {
                return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
            else {
                return response.status(StatusCodes.ACCEPTED).json({ accessToken })
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Email ou senha são invalidos.' });
        } else {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
}