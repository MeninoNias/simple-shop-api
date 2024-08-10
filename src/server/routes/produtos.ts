import { Router } from 'express';
import { ProdutoController } from '../controllers';
import { ensureAuthenticated, adminAuthenticated } from '../shared/middleware';

const router = Router();

router.get('/', [ensureAuthenticated, adminAuthenticated], ProdutoController.getAllProdutos);
router.post('/', [ensureAuthenticated, adminAuthenticated], ProdutoController.createValidation, ProdutoController.createProduto);
router.put('/:id', [ensureAuthenticated, adminAuthenticated], ProdutoController.updateValidation, ProdutoController.updateProduto);
router.get('/:id', [ensureAuthenticated, adminAuthenticated], ProdutoController.findByIdValidation, ProdutoController.findById);
router.delete('/:id', [ensureAuthenticated, adminAuthenticated], ProdutoController.deleteByIdValidation, ProdutoController.deleteById);

export default router;