import { Role } from '@prisma/client';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';



export const adminAuthenticated: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Not authenticated' }
        });
    }
    if (user.type !== Role.ADMIN) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Permission denied' }
        });
    }

    return next();
};