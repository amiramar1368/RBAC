 import {Router}  from 'express';
 import {setToken} from '../middlewares/jwt.js';


var router =  new Router();

router.post('/',setToken, (req, res) =>{
  let user= req.loginUser;
  let token = req.token;
  res.status(200).json({
    success:true,
      user,
      token,
    message:"Login Successfully"
  })
});

export default router;