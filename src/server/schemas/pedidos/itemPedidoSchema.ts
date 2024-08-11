import * as yup from 'yup';
import { InferType } from 'yup';

export const itemPedidoSchema = yup.object().shape({
    produtoId: yup.number()
        .required('O campo "produtoId" é obrigatório.')
        .integer('O campo "produtoId" deve ser um número inteiro.')
        .positive('O campo "produtoId" deve ser um número positivo.'),

    quantidade: yup.number()
        .required('O campo "quantidade" é obrigatório.')
        .integer('O campo "quantidade" deve ser um número inteiro.')
        .positive('O campo "quantidade" deve ser um número positivo.'),

});

export type ItemPedidoSchema = InferType<typeof itemPedidoSchema>;