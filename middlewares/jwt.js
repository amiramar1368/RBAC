import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { ACCESS_TOKEN,ACCESS_TOKEN_EXPIRE } from "../config.js";

export const setToken = async (req, res, next) => {
  const { login, password } = req.body;
  try {
  if (login == undefined || password == undefined) {
   return res.sendError({statusCode:400,message:"login and password are required"})
  }
    const user = await req.models.User.findOne({
      where: {
        login,
      },
      include: [
        {
          model: req.models.Role,
          include: [
            {
              model: req.models.RolePermission,
              association: "permissionsRoles",
              include: [req.models.Permission],
            },
          ],
        },
      ],
    });
    if (user) {
      const passwordIsMatch = await bcrypt.compare(password, user.password);
      if (!passwordIsMatch) {
        return res.sendError({statusCode:404,message:"login or password is wrong"})
      }
      const permissions = [];
      const allPermissions = user.role.permissionsRoles;
      allPermissions.forEach((item) => {
        permissions.push(item.permission.name);
      });
      const loginUser = {id:user.id, name: user.name, role: user.role.name, login: user.login, permissions };
      const token = jwt.sign(loginUser, ACCESS_TOKEN, { expiresIn: `${ACCESS_TOKEN_EXPIRE}s` });
      await req.models.RefreshToken.destroy({where:{user_id:user.id}})
      const refreshToken  =await req.models.RefreshToken.createToken(user.id)
      res.setHeader("token",`Bearer ${token}`);
      res.setHeader("refreshToken",refreshToken);
      req.loginUser = loginUser;
      next();
    } else {
      return res.sendError({statusCode:404,message:"User Not Found"})
    }
  } catch (err) {
    res.sendError({statusbar:500,message:err.message})
  }
};
