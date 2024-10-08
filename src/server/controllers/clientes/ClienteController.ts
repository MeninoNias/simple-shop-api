/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { validation } from '../../shared/middleware/Validation';

import { clienteService } from '../../service';
import {
    ClienteCreateSchema,
    clienteCreateSchema,
    ClienteUpdateSchema,
    clienteUpdateSchema
} from "../../schemas/clientes";
import { ParamPropsShema, paramPropsShema } from "../../schemas/utils/ParamPropsShema";
import { searchPropsSchema, SearchPropsSchema } from "../../schemas/utils/SearchPropsSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "../../shared/exception/PrismaParseError";
import { sendMailUserConfirm } from "../../shared/services";

interface IParamProps {
    id?: number;
}

interface IQueryProps {
    search?: string;
  }

export const createValidation = validation((getSchema) => ({
    body: getSchema<ClienteCreateSchema>(clienteCreateSchema),
}));

export const findAllValidation = validation((getSchema) => ({
    query: getSchema<SearchPropsSchema>(searchPropsSchema),
}));

export const deleteByIdValidation = validation(get => ({
    params: get<ParamPropsShema>(paramPropsShema),
}));

export const findByIdValidation = validation(get => ({
    params: get<ParamPropsShema>(paramPropsShema),
}));

export const updateValidation = validation(get => ({
    body: get<ClienteUpdateSchema>(clienteUpdateSchema),
    params: get<ParamPropsShema>(paramPropsShema),
}));

export const getMeCliente = async (request: Request, response: Response) => {
    try {
        const user = request.user
        if (!user) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Não autenticado.' });
        }

        const Cliente = await clienteService.getClienteDetailByUser(user.id)

        if (!Cliente) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        return response.status(StatusCodes.OK).json(Cliente);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }

    }
}

export const createCliente = async (request: Request<{}, {}, ClienteCreateSchema>, response: Response, next: NextFunction) => {
    try {
        const data = request.body
        const newCliente = await clienteService.createCliente(data);
        if (newCliente.user) {
            sendMailUserConfirm(newCliente.user);
        }
        return response.status(StatusCodes.CREATED).json(newCliente);

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

        const ClienteDelete = await clienteService.getClienteById(id)

        if (!ClienteDelete) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        const result = await clienteService.deleteClienteById(id);

        return response.status(StatusCodes.OK).json({ detail: 'Cliente deleted successfully' });
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

        const Cliente = await clienteService.getClienteById(id)

        if (!Cliente) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        return response.status(StatusCodes.OK).json(Cliente);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }

    }
}

export const getAllClientes = async (request: Request<{}, {}, {}, IQueryProps>, response: Response) => {
    try {
        const { search } = request.query || '';

        const clientes = await clienteService.getAllClientes(search || '');

        return response.status(StatusCodes.OK).json(clientes);
    } catch (error) {
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        } else {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
};

export const updateCliente = async (request: Request<IParamProps, {}, ClienteUpdateSchema>, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;

        if (!id) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                errors: {
                    default: 'O parâmetro "id" precisa ser informado.'
                }
            });
        }


        const Cliente = await clienteService.getClienteById(id)

        if (!Cliente) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        const result = await clienteService.updateCliente(id, request.body);

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
