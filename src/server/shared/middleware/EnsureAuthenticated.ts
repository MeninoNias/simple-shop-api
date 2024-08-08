import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { JWTService } from '../services';
import { userService } from '../../service/userService';


export const ensureAuthenticated: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Não autenticado' }
        });
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Não autenticado' }
        });
    }

    const jwtData = JWTService.verify(token);
    if (jwtData === 'JWT_SECRET_NOT_FOUND') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: 'Erro ao verificar o token' }
        });
    } else if (jwtData === 'INVALID_TOKEN') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Não autenticado' }
        });
    }
    const userId: number = Number(jwtData.uid.toString());
    const user = await userService.getUserById(userId);
    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Não autenticado' }
        });
    }

    req.headers.idUsuario = jwtData.uid.toString();
    req.user = user

    return next();
};