 import {Router}  from 'express';
 import {setToken} from '../middlewares/jwt.js';

 import {ACCESS_TOKEN, ACCESS_TOKEN_EXPIRE} from '../config.js';

var router =  new Router();

router.post('/',setToken, (req, res) =>{
  let user= req.loginUser;
  let token = req.token;
  let refreshToken = req.refreshToken;
  res.status(200).json({
    success:true,
      user,
      token,
      refreshToken,
    message:"Login Successfully"
  })
});


router.post("/refresh-token",async(req,res,next)=>{
    const { refreshToken: requestToken } = req.body;
  
    if (requestToken == null) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }
  
    try {
      let refreshToken = await req.models.findOne({ where: { token: requestToken } });
  
      if (!refreshToken) {
        res.status(403).json({ message: "Refresh token is not in database!" });
        return;
      }
  
      if (req.models.RefreshToken.verifyExpiration(refreshToken)) {
        req.models.RefreshToken.destroy({ where: { id: refreshToken.id } });
        
        res.status(403).json({
          message: "Refresh token was expired. Please make a new signin request",
        });
        return;
      }
  
      let newAccessToken = jwt.sign({ id: refreshToken.user_id }, ACCESS_TOKEN, {
        expiresIn: ACCESS_TOKEN_EXPIRE,
      });
  
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
})
export default router;