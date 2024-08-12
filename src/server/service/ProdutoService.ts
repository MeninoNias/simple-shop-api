import { ProdutoCreateSchema, ProdutoUpdateSchema } from '../schemas/produtos';
import prisma from '../database';
import { IProduto } from '../database/models/Produto';

export const produtoService = {
    createProduto: async (data: ProdutoCreateSchema): Promise<IProduto> => {
        const newProduto = await prisma.produto.create({
            data: {
                nome: data.nome,
                descricao: data.descricao,
                preco: data.preco,
                quantidadeEmEstoque: data.quantidadeEmEstoque
            }
        });

        return newProduto;
    },

    getProdutoById: async (id: number): Promise<IProduto | null> => {
        const cliente = await prisma.produto.findUnique({
            where: {
                id: Number(id),
            },
        });
        return cliente;
    },

    deleteProdutoById: async (id: number): Promise<IProduto | null> => {
        const deleteProduto = await prisma.$transaction(async (prisma) => {
            const produto = await prisma.produto.delete({
                where: { id: Number(id) },
            });

            return produto
        })
        return deleteProduto;
    },

    updateProduto: async (id: number, data: ProdutoUpdateSchema): Promise<IProduto | null> => {
        const updateProduto = await prisma.produto.update({
            where: { id: Number(id) },
            data: data
        });
        return updateProduto;
    },

    getAllProduto: async (): Promise<IProduto[]> => {
        const produtos = await prisma.produto.findMany({});
        return produtos;
    },
};
