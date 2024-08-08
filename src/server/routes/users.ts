import { Router } from 'express';
import { UserController } from '../controllers';
import { ensureAuthenticated, adminAuthenticated } from '../shared/middleware';

const router = Router();

router.post('/login', UserController.loginUserValidation, UserController.loginUser);
router.post('/cadastrar', [ensureAuthenticated, adminAuthenticated], UserController.createUserValidation, UserController.createUser);

router.get('/', [ensureAuthenticated, adminAuthenticated], UserController.getAllUsers);
router.get('/:id', [ensureAuthenticated, adminAuthenticated], UserController.findByIdValidation, UserController.findById);
router.put('/:id', [ensureAuthenticated, adminAuthenticated], UserController.updateValidation, UserController.updateUser);
router.delete('/:id', [ensureAuthenticated, adminAuthenticated], UserController.deleteByIdValidation, UserController.deleteById);
router.get('/confirm/:id', UserController.confirmValidation, UserController.confirmUser);

export default router;