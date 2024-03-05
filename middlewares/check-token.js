import jwt from "jsonwebtoken";

import { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRE } from "../config.js";

export default async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];
    const token = authorization?.split(" ")[1] || undefined;
    const refreshToken = req.headers["refreshtoken"];

    if (!token || !refreshToken) {
      return res.sendError({ statusCode: 401, message: "No Token Or Refresh Token Provided" });
    }
    res.setHeader("token",`Bearer ${token}`);
    res.setHeader("refreshToken",refreshToken);

    jwt.verify(token, ACCESS_TOKEN, async (err, user) => {
      if (err) {
        const refreshToken = req.headers["refreshtoken"];
        if (!refreshToken) {
          return res.sendError({ statusCode: 401, message: "No Refresh Token Provided" });
        }
        const refreshTokenRecord = await req.models.RefreshToken.findOne({
          where: { token: refreshToken },
          include: {
            model: req.models.User,
            include: {
              model: req.models.Role,
              include: [
                {
                  model: req.models.RolePermission,
                  association: "permissionsRoles",
                  include: [req.models.Permission],
                },
              ],
            },
          },
        });
        if (!refreshTokenRecord) {
          return res.sendError({ statusCode: 403, message: "Invalid Refresh Token. Please Relogin" });
        }
        const user =refreshTokenRecord.user
        const refreshTokenIsValid = req.models.RefreshToken.checkExpiration(refreshTokenRecord);
        if (refreshTokenIsValid) {
        const permissions = [];
        const allPermissions =user.role.permissionsRoles;
        allPermissions.forEach((item) => {
          permissions.push(item.permission.name);
        });
          const loginUser = { id: user.id, name: user.name, role: user.role.name, login: user.login, permissions };
          const token = jwt.sign(loginUser, ACCESS_TOKEN, { expiresIn: `${ACCESS_TOKEN_EXPIRE}s` });

          //remove all records belong to this user
          await req.models.RefreshToken.destroy({where:{
            user_id:user.id
          }})

          const refreshToken = await req.models.RefreshToken.createToken(user.id);
          res.setHeader("token",`Bearer ${token}`);
          res.setHeader("refreshToken",refreshToken);
          req.user =loginUser
          next();
        }else{
          await req.models.RefreshToken.destroy({where:{
            user_id:user.id
          }})
          return res.sendError({ statusCode: 401, message: "Invalid Token" });
        }
      }else{
        req.user = user;
        next();
      }
    });
  } catch (err) {
    console.log(1020);
    return res.sendError({ statusCode: 500, message: err.message });
  }
};
