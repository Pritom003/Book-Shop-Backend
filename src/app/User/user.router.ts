import { Router } from 'express';

import { UserController } from './user.controller';
import { USER_ROLE } from './user.const';
import auth from '../Middleware/auth';
import { upload } from '../Utils/SendImageToCloudinary';
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
router.post(
  '/profile',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  upload.fields([{ name: 'Profileimage', maxCount: 1 }]),
  UserController.updateMyProfile
);

router.get('/users', auth(USER_ROLE.ADMIN), UserController.getAllCustomers);
router.patch("/users/:userId/make-admin", auth(USER_ROLE.ADMIN), UserController.makeAdmin);
router.patch("/users/:userId/remove-admin", auth(USER_ROLE.ADMIN), UserController.removeAdmin);
router.delete("/users/:userId", auth(USER_ROLE.ADMIN), UserController.deleteUser);



export const userRoutes = router;