/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";

export default {

    async createUser(request: Request, response: Response) {
        try {
            const { name, email } = request.body;
            const userExist = false;

            if (userExist) {
                return response.json({
                    error: true,
                    message: 'Erro: usuario já existe'
                });
            }
            else {
                console.log(name, email)
            }

        } catch (error) {
            return response.json({ message: "Erro: erro ao criar usuario" })
        }

    }
}