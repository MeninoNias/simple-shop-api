/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';


export const PrismaParseError = (err: any, _: any, res: Response, next: NextFunction) => {
    if (err instanceof PrismaClientKnownRequestError) {
        const error = handlePrismaError(err);
        res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: error
            }
        });
    } else {
        next();
    }
};

export const handlePrismaError = (err: PrismaClientKnownRequestError): string => {
    switch (err.code) {
        case 'P2002':
            return `Duplicate field value: ${err.meta?.target}`;
        case 'P2014':
            return `Invalid ID: ${err.meta?.target}`;
        case 'P2003':
            return `Invalid input data: ${err.meta?.target}`;
        default:
            return `Something went wrong: ${err.message}`;
    }
};