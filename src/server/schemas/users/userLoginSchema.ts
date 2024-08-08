import * as yup from 'yup';
import { InferType } from 'yup';

export const userLoginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    password: yup
        .string()
        .required('Password is required'),
});

export type UserLoginSchema = InferType<typeof userLoginSchema>;