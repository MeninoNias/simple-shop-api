import { Router } from 'express';
import userRoutes from './users';
import clienteRoutes from './clientes'
import produtoRoutes from './produtos'
import pedidoRoutes from './pedidos'

const router = Router();

router.use('/user', userRoutes);
router.use('/cliente', clienteRoutes);
router.use('/produto', produtoRoutes);
router.use('/pedido', pedidoRoutes);

export { router };