import * as yup from 'yup';
import { InferType } from 'yup';
import { itemPedidoSchema } from './itemPedidoSchema';


export const pedidoUpdateSchema = yup.object().shape({

    dataPedido: yup.date()
        .required('O campo "dataPedido" é obrigatório.')
        .default(() => new Date()),

    ItemPedido: yup.array().of(itemPedidoSchema).required('O pedido deve conter pelo menos um item.')
});

export type PedidoUpdateSchema = InferType<typeof pedidoUpdateSchema>;