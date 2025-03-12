import { Router } from 'express';

import { UserController } from './user.controller';
import { USER_ROLE } from './user.const';
import auth from '../Middleware/auth';
const router = Router();
router.patch(
  '/users/:userId/block',
  auth(USER_ROLE.ADMIN),
  UserController.blockUser,
);
router.get(
  '/profile',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserController.getMyProfile,
);
router.get('/', auth(USER_ROLE.ADMIN), UserController.getAllCustomers);

export const userRoutes = router;