/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { validation } from '../../shared/middleware/Validation';

import { pedidoService } from '../../service';
import {
    pedidoCreateSchema,
    PedidoCreateSchema,
} from "../../schemas/pedidos";
import { ParamPropsShema, paramPropsShema } from "../../schemas/utils/ParamPropsShema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "../../shared/exception/PrismaParseError";

interface IParamProps {
    id?: number;
}

export const createValidation = validation((getSchema) => ({
    body: getSchema<PedidoCreateSchema>(pedidoCreateSchema),
}));

export const deleteByIdValidation = validation(get => ({
    params: get<ParamPropsShema>(paramPropsShema),
}));

export const findByIdValidation = validation(get => ({
    params: get<ParamPropsShema>(paramPropsShema),
}));

// export const updateValidation = validation(get => ({
//     body: get<ProdutoUpdateSchema>(produtoUpdateSchema),
//     params: get<ParamPropsShema>(paramPropsShema),
// }));


export const createPedido = async (request: Request<{}, {}, PedidoCreateSchema>, response: Response, next: NextFunction) => {
    try {
        const data = request.body
        const user = request.user
        if (!user || !user.cliente) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Não autenticado.' });
        }
        const newPedido = await pedidoService.createPedido(data, user.cliente.id);
        return response.status(StatusCodes.CREATED).json(newPedido);

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            console.log('error', error.message, error.stack)
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        } else {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
};

export const deleteById = async (request: Request<IParamProps>, response: Response) => {
    try {
        const { id } = request.params;
        const user = request.user
        console.log('user', user)
        if (!user || !user.cliente) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Sem permissão.' });
        }

        if (!id) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                errors: {
                    default: 'O parâmetro "id" precisa ser informado.'
                }
            });
        }

        const produtoDelete = await pedidoService.getPedidoById(id, user.cliente.id)

        if (!produtoDelete) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        const result = await pedidoService.deletePedidoById(id);

        return response.status(StatusCodes.OK).json({ detail: 'Produto deleted successfully' });
    } catch (error) {
        console.log('error', error)
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            console.log('error', error.message)
            console.log('error', error.stack)
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }

    }
}

export const findById = async (request: Request<IParamProps>, response: Response) => {
    try {
        const { id } = request.params;
        const user = request.user
        if (!user || !user.cliente) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Sem permissão.' });
        }

        if (!id) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                errors: {
                    default: 'O parâmetro "id" precisa ser informado.'
                }
            });
        }

        const pedido = await pedidoService.getPedidoById(id, user.cliente.id)

        if (!pedido) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        return response.status(StatusCodes.OK).json(pedido);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }

    }
}

export const getAllPedidos = async (request: Request, response: Response) => {
    try {
        const pedidos = await pedidoService.getAllPedido();
        return response.status(StatusCodes.OK).json(pedidos);
    } catch (error) {
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        } else {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
};

// export const updatePedido = async (request: Request<IParamProps, {}, ProdutoUpdateSchema>, response: Response, next: NextFunction) => {
//     try {
//         const { id } = request.params;

//         if (!id) {
//             return response.status(StatusCodes.BAD_REQUEST).json({
//                 errors: {
//                     default: 'O parâmetro "id" precisa ser informado.'
//                 }
//             });
//         }


//         const produto = await pedidoService.getProdutoById(id)

//         if (!produto) {
//             return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
//         }

//         const result = await pedidoService.updateProduto(id, request.body);

//         return response.status(StatusCodes.OK).json({ result });

//     } catch (error) {
//         if (error instanceof PrismaClientKnownRequestError) {
//             return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
//         }
//         if (error instanceof Error) {
//             return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
//         }

//     }
// }
