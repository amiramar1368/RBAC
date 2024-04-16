 import {Router}  from 'express';
 import {setToken} from '../middlewares/jwt.js';


var router =  new Router();

router.post('/',setToken, (req, res) =>{
  res.sendSuccess(200,"Login Successfully",{
    user:req.resultData.loginUser,
    token:req.resultData.token,
    refreshToken:req.resultData.refreshToken
  })
});

export default router;