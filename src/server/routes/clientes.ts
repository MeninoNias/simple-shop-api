import { Router } from 'express';
import { ClienteController } from '../controllers';
import { ensureAuthenticated, adminAuthenticated } from '../shared/middleware';

const router = Router();

router.get('/', [ensureAuthenticated, adminAuthenticated], ClienteController.getAllClientes);
router.post('/', [ensureAuthenticated, adminAuthenticated], ClienteController.createValidation, ClienteController.createCliente);
router.put('/:id', [ensureAuthenticated, adminAuthenticated], ClienteController.updateValidation, ClienteController.updateCliente);
router.get('/:id', [ensureAuthenticated, adminAuthenticated], ClienteController.findByIdValidation, ClienteController.findById);
router.delete('/:id', [ensureAuthenticated, adminAuthenticated], ClienteController.deleteByIdValidation, ClienteController.deleteById);

export default router;