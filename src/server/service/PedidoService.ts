import { PedidoCreateSchema } from '../schemas/pedidos';
import prisma from '../database';
import { IPedido } from 'server/database/models/Pedido';
import { Decimal } from '@prisma/client/runtime/library';

export const pedidoService = {
    createPedido: async (data: PedidoCreateSchema, clientId: number): Promise<IPedido> => {
        const pedido = await prisma.$transaction(async (prisma) => {
            let totalPreco = new Decimal(0)
            const itensPedidoData = await Promise.all(
                data.ItemPedido.map(async (item) => {
                    const produto = await prisma.produto.findUnique({
                        where: { id: item.produtoId },
                    });

                    if (!produto) {
                        throw new Error(`Produto com ID ${item.produtoId} não encontrado`);
                    }
                    totalPreco = totalPreco.plus(produto.preco.times(item.quantidade))
                    return {
                        produtoId: item.produtoId,
                        quantidade: item.quantidade,
                        precoUnitario: produto.preco,
                        subtotal: produto.preco.times(item.quantidade),
                    };
                })
            );

            const newPedido = await prisma.pedido.create({
                data: {
                    clienteId: clientId,
                    dataPedido: data.dataPedido,
                    ItemPedido: {
                        createMany: {
                            data: itensPedidoData
                        }
                    },
                    total: totalPreco
                },
                include: {
                    ItemPedido: true
                }
            });

            return newPedido;
        })

        return pedido;
    },

    getPedidoById: async (id: number, clienteId: number): Promise<IPedido | null> => {
        const pedido = await prisma.pedido.findUnique({
            where: {
                id: Number(id),
                clienteId: clienteId
            },
        });
        return pedido;
    },

    deletePedidoById: async (id: number): Promise<IPedido | null> => {
        const pedido = await prisma.pedido.delete({
            where: { id: Number(id) },
        });

        return pedido
    },

    // updateProduto: async (id: number, data: ProdutoUpdateSchema): Promise<IProduto | null> => {
    //     const updateProduto = await prisma.produto.update({
    //         where: { id: Number(id) },
    //         data: data
    //     });
    //     return updateProduto;
    // },

    getAllPedido: async (): Promise<IPedido[]> => {
        const pedidos = await prisma.pedido.findMany({ include: { ItemPedido: true } });
        return pedidos;
    },
};
