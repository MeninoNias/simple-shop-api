import * as yup from 'yup';
import { InferType } from 'yup';

export const userUpdateSchema = yup.object().shape({
    name: yup.string().min(3),
    emailConfirm: yup.boolean(),
    email: yup
        .string()
        .min(3)
        .email('Invalid email format'),
});

export type UserUpdateSchema = InferType<typeof userUpdateSchema>;