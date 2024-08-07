import { Router } from 'express';
import { UserController } from '../controllers';
import { ensureAuthenticated } from '../shared/middleware';

const router = Router();

router.post('/login', UserController.loginUserValidation, UserController.loginUser);
router.post('/cadastrar', UserController.createUserValidation, UserController.createUser);

router.get('/', ensureAuthenticated, UserController.getAllUsers);
router.get('/:id', ensureAuthenticated, UserController.findByIdValidation, UserController.findById);
router.delete('/:id', ensureAuthenticated, UserController.deleteByIdValidation, UserController.deleteById);

export default router;