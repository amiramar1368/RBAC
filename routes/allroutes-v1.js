import {Router} from 'express';

import {UserController} from '../controllers/user-controller.js';
import {permission} from '../middlewares/permission.js';

const router = new Router();

router.route('/users')
  .get(permission(["fetchUser"]),UserController.fetchAllUsers)
  .post(permission(["addUser"]),UserController.addUser);

export default router;