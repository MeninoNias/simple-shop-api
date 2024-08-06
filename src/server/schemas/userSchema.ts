import * as yup from 'yup';
import { InferType } from 'yup';

export const userSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    type: yup
        .string()
        .oneOf(['CLIENT', 'ADMIN'], 'Invalid role type')
        .default('CLIENT'),
});

export type UserSchema = InferType<typeof userSchema>;