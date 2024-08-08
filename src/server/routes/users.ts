import { Router } from 'express';
import { UserController } from '../controllers';
import { ensureAuthenticated, adminAuthenticated } from '../shared/middleware';

const router = Router();

router.post('/login', UserController.loginUserValidation, UserController.loginUser);
router.post('/cadastrar', UserController.createUserValidation, UserController.createUser);

router.get('/', [ensureAuthenticated, adminAuthenticated], UserController.getAllUsers);
router.get('/:id', [ensureAuthenticated, adminAuthenticated], UserController.findByIdValidation, UserController.findById);
router.get('/confirm/:id', UserController.updateValidation, UserController.confirmUser);
router.delete('/:id', [ensureAuthenticated, adminAuthenticated], UserController.deleteByIdValidation, UserController.deleteById);

export default router;