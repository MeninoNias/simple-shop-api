import { Router } from 'express';
import { UserController } from '../controllers';

const router = Router();

router.post('/', UserController.createUserValidation, UserController.createUser);
router.get('/', UserController.getAllUsers);

export default router;