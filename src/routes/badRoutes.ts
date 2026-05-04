import { Router } from 'express';
import BadExampleController from '../controllers/BadExampleController';

const router = Router();

// 🔴 SECURITY: rota sensível sem middleware de auth
router.post('/admin/users', BadExampleController.createUser);

// 🔴 SECURITY: rota de update sem auth
router.patch('/admin/users/:id/password', BadExampleController.updatePassword);

// 🔴 endpoint de busca sem rate limit nem auth
router.get('/admin/search', BadExampleController.searchUsers);

export default router;