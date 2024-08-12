import { Router } from 'express';
import { PedidoController } from '../controllers';
import { ensureAuthenticated } from '../shared/middleware';

const router = Router();

router.get('/', [ensureAuthenticated], PedidoController.getAllPedidos);
router.post('/', [ensureAuthenticated], PedidoController.createValidation,  PedidoController.createPedido);
router.get('/:id', [ensureAuthenticated], PedidoController.findByIdValidation, PedidoController.findById);
router.delete('/:id', [ensureAuthenticated], PedidoController.deleteByIdValidation, PedidoController.deleteById);
router.patch('/:id', [ensureAuthenticated], PedidoController.updateValidation, PedidoController.createItemPedido);
router.put('/:id', [ensureAuthenticated], PedidoController.updateValidation, PedidoController.updatePedido);

export default router;