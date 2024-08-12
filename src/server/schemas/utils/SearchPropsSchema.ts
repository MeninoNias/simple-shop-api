import * as yup from 'yup';
import { InferType } from 'yup';

export const searchPropsSchema = yup.object().shape({
    search: yup.string().optional(),
});

export type SearchPropsSchema = InferType<typeof searchPropsSchema>;