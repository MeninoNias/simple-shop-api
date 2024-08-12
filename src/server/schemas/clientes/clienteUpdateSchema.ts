import * as yup from 'yup';
import { InferType } from 'yup';

export const clienteUpdateSchema = yup.object().shape({
    nome: yup.string()
        .required('O campo nome é obrigatório.')
        .min(3, 'O campo nome deve ter pelo menos 3 caracteres.')
        .max(255, 'O campo nome deve ter no máximo 255 caracteres.'),

    email: yup
        .string()
        .email('Formato de email invalido')
        .required('O campo email é obrigatorio'),

    contato: yup.string()
        .required('O campo contato é obrigatório.')
        .min(10, 'O campo contato deve ter pelo menos 10 caracteres.')
        .max(20, 'O campo contato deve ter no máximo 20 caracteres.'),

    endereco: yup.string()
        .required('O campo endereco é obrigatório.')
        .min(10, 'O campo endereco deve ter pelo menos 10 caracteres.')
        .max(255, 'O campo endereco deve ter no máximo 255 caracteres.'),
});

export type ClienteUpdateSchema = InferType<typeof clienteUpdateSchema>;