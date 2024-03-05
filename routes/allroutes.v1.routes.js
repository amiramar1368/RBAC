import {Router} from 'express';
import 'express-group-routes';

import {UserController} from '../controllers/user-controller.js';
import {permission} from '../middlewares/permission.js';
const router = new Router();

router.group("/users",(router)=>{
    router.get("/",permission(["fetchUser"]),UserController.fetchAllUsers);
    router.post("/",permission(["addUser"]),UserController.addUser)
})

export default router;