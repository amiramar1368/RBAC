 import {Router}  from 'express';
 import {setToken} from '../middlewares/jwt.js';


var router =  new Router();

router.post('/',setToken, (req, res) =>{
  res.sendSuccess(200,"Login Successfully",req.loginUser)
});

export default router;