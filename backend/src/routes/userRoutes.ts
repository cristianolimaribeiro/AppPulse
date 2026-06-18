import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const userRoutes = Router();
const userController = new UserController();

userRoutes.use(authenticate);
userRoutes.use(requireRole(['admin']));

userRoutes.get('/', userController.list);
userRoutes.post('/', userController.create);
userRoutes.put('/:id', userController.update);
userRoutes.patch('/:id/toggle-active', userController.toggleActive);

export { userRoutes };