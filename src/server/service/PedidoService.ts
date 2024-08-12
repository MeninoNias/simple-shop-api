import { ItemPedidoSchema, PedidoCreateSchema } from '../schemas/pedidos';
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

    updatePedido: async (data: PedidoCreateSchema, pedidoId: number): Promise<IPedido> => {
        const pedido = await prisma.$transaction(async (prisma) => {
            const itensPedidoData = await Promise.all(
                data.ItemPedido.map(async (item) => {
                    const produto = await prisma.produto.findUnique({
                        where: { id: item.produtoId },
                    });

                    if (!produto) {
                        throw new Error(`Produto com ID ${item.produtoId} não encontrado`);
                    }

                    const idItem = item.id !== undefined ? item.id : null 
                    const itensPedidos = await prisma.itemPedido.upsert({
                        where: {
                            id: Number(idItem)
                        },
                        create: {
                            pedidoId: Number(pedidoId),
                            produtoId: item.produtoId,
                            precoUnitario: produto.preco,
                            quantidade: item.quantidade,
                            subtotal: produto.preco.times(item.quantidade)
                        },
                        update: {
                            precoUnitario: produto.preco,
                            quantidade: item.quantidade,
                            subtotal: produto.preco.times(item.quantidade)
                        },
                    })

                    return itensPedidos;
                })
            );
            console.log(itensPedidoData)
            const sumPedido = await prisma.itemPedido.aggregate({
                _sum: {
                    subtotal: true
                }
            })
            const totalPedido = new Decimal(sumPedido._sum.subtotal || 0)
            const updatePedido = await prisma.pedido.update({
                where: { id: Number(pedidoId) },
                data: {
                    dataPedido: data.dataPedido,
                    total: totalPedido
                },
                include: {
                    ItemPedido: true
                }
            });

            return updatePedido;
        })

        return pedido;
    },

    createItemPedido: async (data: ItemPedidoSchema, pedido: IPedido): Promise<IPedido | Error> => {
        const newPedido = await prisma.$transaction(async (prisma) => {
            let pedidoItem = null
            const produto = await prisma.produto.findUnique({ where: { id: Number(data.produtoId) } });
            if (produto) {
                const newItemPedido = await prisma.itemPedido.create({
                    data: {
                        pedidoId: Number(pedido.id),
                        produtoId: data.produtoId,
                        quantidade: data.quantidade,
                        precoUnitario: produto.preco,
                        subtotal: produto.preco.times(data.quantidade)
                    },
                    include: {
                        pedido: {
                            include: {
                                ItemPedido: true
                            }
                        }
                    }
                });
                console.log('newItemPedido', newItemPedido)
            }
            else {
                throw Error('Produto não encontrado')
            }
            const itensPedidos = await prisma.itemPedido.aggregate({
                where: { pedidoId: Number(pedido.id) },
                _sum: { subtotal: true }
            });
            const total = new Decimal(itensPedidos._sum.subtotal || 0)
            pedidoItem = await prisma.pedido.update({
                where: { id: (pedido.id) },
                data: {
                    total: total
                },
                include: {
                    ItemPedido: true
                }
            })
            return pedidoItem;
        })

        return newPedido;
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
