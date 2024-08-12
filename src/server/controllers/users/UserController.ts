/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { validation } from '../../shared/middleware/Validation';

import { userService } from "../../service/userService";
import {
    UserCreateSchema,
    userCreateSchema,
    userLoginSchema,
    UserLoginSchema,
    userUpdateSchema,
    UserUpdateSchema
} from "../../schemas/users";
import { ParamPropsShema, paramPropsShema } from "../../schemas/utils/ParamPropsShema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "../../shared/exception/PrismaParseError";
import { JWTService, PasswordCrypto, sendMailUserConfirm } from "../../shared/services";

interface IParamProps {
    id?: number;
}

export const createUserValidation = validation((getSchema) => ({
    body: getSchema<UserCreateSchema>(userCreateSchema),
}));

export const loginUserValidation = validation((getSchema) => ({
    body: getSchema<UserLoginSchema>(userLoginSchema),
}));

export const deleteByIdValidation = validation(get => ({
    params: get<ParamPropsShema>(paramPropsShema),
}));

export const findByIdValidation = validation(get => ({
    params: get<ParamPropsShema>(paramPropsShema),
}));

export const confirmValidation = validation(get => ({
    params: get<ParamPropsShema>(paramPropsShema),
}));

export const updateValidation = validation(get => ({
    body: get<UserUpdateSchema>(userUpdateSchema),
    params: get<ParamPropsShema>(paramPropsShema),
}));

export const createUser = async (request: Request<{}, {}, UserCreateSchema>, response: Response, next: NextFunction) => {
    try {
        const data = request.body
        const newUser = await userService.createUser(data);
        sendMailUserConfirm(newUser);
        return response.status(StatusCodes.CREATED).json(newUser);

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            console.log(error.message)
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        } else {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
};

export const deleteById = async (request: Request<IParamProps>, response: Response) => {
    try {
        const { id } = request.params;

        if (!id) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                errors: {
                    default: 'O parâmetro "id" precisa ser informado.'
                }
            });
        }

        const userDelete = await userService.getUserById(id)

        if (!userDelete) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        const result = await userService.deleteById(id);

        return response.status(StatusCodes.OK).json({ detail: 'User deleted successfully' });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }

    }
}

export const findById = async (request: Request<IParamProps>, response: Response) => {
    try {
        const { id } = request.params;

        if (!id) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                errors: {
                    default: 'O parâmetro "id" precisa ser informado.'
                }
            });
        }

        const user = await userService.getUserById(id)

        if (!user) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        return response.status(StatusCodes.OK).json(user);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }

    }
}

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

export const updateUser = async (request: Request<IParamProps, {}, UserUpdateSchema>, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;

        if (!id) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                errors: {
                    default: 'O parâmetro "id" precisa ser informado.'
                }
            });
        }

        const result = await userService.updateUser(id, request.body);

        return response.status(StatusCodes.OK).json({ result });

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }

    }
}


export const confirmUser = async (request: Request<IParamProps>, response: Response) => {
    try {
        const { id } = request.params;

        if (!id) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                errors: {
                    default: 'O parâmetro "id" precisa ser informado.'
                }
            });
        }

        const userUpdate = await userService.getUserById(id)

        if (!userUpdate) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        if (userUpdate.emailConfirm) {
            return response.status(StatusCodes.NOT_MODIFIED).json({ detail: 'User has already been confirmed' });
        }

        userUpdate.emailConfirm = true;
        const result = await userService.updateUser(id, userUpdate);

        return response.status(StatusCodes.OK).json({ detail: 'User confirmed successfully' });

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }

    }
}

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
        if (!result.emailConfirm){
            return response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Email não confirmado, verifique sua caixa de email.' });
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