import * as yup from 'yup';
import { InferType } from 'yup';


export const clienteCreateSchema = yup.object().shape({
    nome: yup.string()
        .required('O campo nome é obrigatório.')
        .min(3, 'O campo nome deve ter pelo menos 3 caracteres.')
        .max(255, 'O campo nome deve ter no máximo 255 caracteres.'),

    email: yup
        .string()
        .email('Formato de email invalido')
        .required('O campo email é obrigatorio'),

    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),

    contato: yup.string()
        .required('O campo contato é obrigatório.')
        .min(10, 'O campo contato deve ter pelo menos 10 caracteres.')
        .max(20, 'O campo contato deve ter no máximo 20 caracteres.'),

    endereco: yup.string()
        .required('O campo endereco é obrigatório.')
        .min(10, 'O campo endereco deve ter pelo menos 10 caracteres.')
        .max(255, 'O campo endereco deve ter no máximo 255 caracteres.'),

});

export type ClienteCreateSchema = InferType<typeof clienteCreateSchema>;