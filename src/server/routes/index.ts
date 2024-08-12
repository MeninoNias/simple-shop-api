import { Router } from 'express';
import userRoutes from './users';
import clienteRoutes from './clientes'

const router = Router();

router.use('/user', userRoutes);
router.use('/cliente', clienteRoutes);

export { router };