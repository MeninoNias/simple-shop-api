import * as yup from 'yup';
import { InferType } from 'yup';

export const paramPropsShema = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

export type ParamPropsShema = InferType<typeof paramPropsShema>;