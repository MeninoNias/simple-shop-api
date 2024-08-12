import * as yup from 'yup';
import { InferType } from 'yup';

export const produtoUpdateSchema = yup.object().shape({
    nome: yup.string()
        .required('O campo "nome" é obrigatório.')
        .min(3, 'O campo "nome" deve ter pelo menos 3 caracteres.')
        .max(255, 'O campo "nome" deve ter no máximo 255 caracteres.'),

    descricao: yup.string()
        .required('O campo "descricao" é obrigatório.')
        .min(10, 'O campo "descricao" deve ter pelo menos 10 caracteres.')
        .max(500, 'O campo "descricao" deve ter no máximo 500 caracteres.'),

    preco: yup.number()
        .required('O campo "preco" é obrigatório.')
        .positive('O campo "preco" deve ser um valor positivo.')
        .test('is-decimal', 'O campo "preco" deve ser um valor decimal com até duas casas decimais.', value => value !== undefined && /^(\d+(\.\d{1,2})?)$/.test(value.toString())),

    quantidadeEmEstoque: yup.number()
        .required('O campo "quantidadeEmEstoque" é obrigatório.')
        .integer('O campo "quantidadeEmEstoque" deve ser um número inteiro.')
        .min(0, 'O campo "quantidadeEmEstoque" deve ser maior ou igual a 0.')

});

export type ProdutoUpdateSchema = InferType<typeof produtoUpdateSchema>;