import { Router } from 'express';
import userRoutes from './users';
import clienteRoutes from './clientes'
import produtoRoutes from './produtos'

const router = Router();

router.use('/user', userRoutes);
router.use('/cliente', clienteRoutes);
router.use('/produto', produtoRoutes);

export { router };