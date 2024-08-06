/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "../service/userService";
import { userSchema } from "../schemas/userSchema";

export const createUser = async (request: Request, response: Response) => {
    try {
        const data = await userSchema.validate(request.body, { abortEarly: false });
        const newUser = await userService.createUser(data);
        return response.status(StatusCodes.CREATED).json(newUser);

    } catch (error) {
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
        return response.status(StatusCodes.OK).json(users);
    } catch (error) {
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        } else {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
};
