/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { validation } from '../../shared/middleware/Validation';

import { produtoService } from '../../service';
import {
    ProdutoCreateSchema,
    produtoCreateSchema,
    ProdutoUpdateSchema,
    produtoUpdateSchema
} from "../../schemas/produtos";
import { ParamPropsShema, paramPropsShema } from "../../schemas/utils/ParamPropsShema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "../../shared/exception/PrismaParseError";
import { sendMailUserConfirm } from "../../shared/services";

interface IParamProps {
    id?: number;
}

export const createValidation = validation((getSchema) => ({
    body: getSchema<ProdutoCreateSchema>(produtoCreateSchema),
}));

export const deleteByIdValidation = validation(get => ({
    params: get<ParamPropsShema>(paramPropsShema),
}));

export const findByIdValidation = validation(get => ({
    params: get<ParamPropsShema>(paramPropsShema),
}));

export const updateValidation = validation(get => ({
    body: get<ProdutoUpdateSchema>(produtoUpdateSchema),
    params: get<ParamPropsShema>(paramPropsShema),
}));


export const createProduto = async (request: Request<{}, {}, ProdutoCreateSchema>, response: Response, next: NextFunction) => {
    try {
        const data = request.body
        const newProduto = await produtoService.createProduto(data);
        return response.status(StatusCodes.CREATED).json(newProduto);

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

        const produtoDelete = await produtoService.getProdutoById(id)

        if (!produtoDelete) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        const result = await produtoService.deleteProdutoById(id);

        return response.status(StatusCodes.OK).json({ detail: 'Produto deleted successfully' });
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

        const produto = await produtoService.getProdutoById(id)

        if (!produto) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        return response.status(StatusCodes.OK).json(produto);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: handlePrismaError(error) });
        }
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }

    }
}

export const getAllProdutos = async (request: Request, response: Response) => {
    try {
        const produtos = await produtoService.getAllProduto();
        return response.status(StatusCodes.OK).json(produtos);
    } catch (error) {
        if (error instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        } else {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
};

export const updateProduto = async (request: Request<IParamProps, {}, ProdutoUpdateSchema>, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;

        if (!id) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                errors: {
                    default: 'O parâmetro "id" precisa ser informado.'
                }
            });
        }


        const produto = await produtoService.getProdutoById(id)

        if (!produto) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Not found.' });
        }

        const result = await produtoService.updateProduto(id, request.body);

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
