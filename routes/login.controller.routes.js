 import {Router}  from 'express';
 import {setToken} from '../middlewares/jwt.js';

 import {ACCESS_TOKEN, ACCESS_TOKEN_EXPIRE} from '../config.js';

var router =  new Router();

router.post('/',setToken, (req, res) =>{
  let user= req.loginUser;
  res.status(200).json({
    success:true,
      user,
    message:"Login Successfully"
  })
});

export default router;