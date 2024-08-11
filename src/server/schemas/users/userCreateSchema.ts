import * as yup from 'yup';
import { InferType } from 'yup';

export const userCreateSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
});

export type UserCreateSchema = InferType<typeof userCreateSchema>;