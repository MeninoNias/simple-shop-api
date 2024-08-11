import { PedidoCreateSchema } from '../schemas/pedidos';
import prisma from '../database';
import { IPedido } from 'server/database/models/Pedido';

export const pedidoService = {
    createPedido: async (data: PedidoCreateSchema, clientId: number): Promise<IPedido> => {
        const pedido = await prisma.$transaction(async (prisma) => {

            const itensPedidoData = await Promise.all(
                data.ItemPedido.map(async (item) => {
                    const produto = await prisma.produto.findUnique({
                        where: { id: item.produtoId },
                    });

                    if (!produto) {
                        throw new Error(`Produto com ID ${item.produtoId} não encontrado`);
                    }

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
                    total: 0
                },
                include: {
                    ItemPedido: true
                }
            });

            return newPedido;
        })

        return pedido;
    },

    // getProdutoById: async (id: number): Promise<IProduto | null> => {
    //     const cliente = await prisma.produto.findUnique({
    //         where: {
    //             id: Number(id),
    //         },
    //     });
    //     return cliente;
    // },

    // deleteProdutoById: async (id: number): Promise<IProduto | null> => {
    //     const deleteProduto = await prisma.$transaction(async (prisma) => {
    //         const produto = await prisma.produto.delete({
    //             where: { id: Number(id) },
    //         });

    //         return produto
    //     })
    //     return deleteProduto;
    // },

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
