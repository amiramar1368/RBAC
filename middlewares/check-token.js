import jwt from "jsonwebtoken";

import {User} from '../models/user.js';
import {RefreshToken} from '../models/refresh-token.js';
import {Role} from '../models/role.js';
import {RolePermission} from '../models/role-permission.js';
import {Permission} from '../models/permission.js';

import { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRE } from "../config.js";

export default async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];
    const token = authorization?.split(" ")[1] || undefined;
    const refreshToken = req.headers["refreshtoken"];
    if (!token || !refreshToken) {
      return res.sendError( 401, "No Token Or Refresh Token Provided");
    }
    res.setHeader("token",`Bearer ${token}`);
    res.setHeader("refreshToken",refreshToken);

    jwt.verify(token, ACCESS_TOKEN, async (err, user) => {
      if (err) {
        const refreshToken = req.headers["refreshtoken"];
        if (!refreshToken) {
          return res.sendError( 401,"No Refresh Token Provided");
        }
        const refreshTokenRecord = await RefreshToken.findOne({
          where: { token: refreshToken },
          include: {
            model: User,
            include: {
              model: Role,
              include: [
                {
                  model: RolePermission,
                  association: "permissionsRoles",
                  include: [Permission],
                },
              ],
            },
          },
        });
        if (!refreshTokenRecord) {
          return res.sendError(401, "Invalid Refresh Token. Please Relogin");
        }
        const user =refreshTokenRecord.user
        const refreshTokenIsValid = RefreshToken.checkExpiration(refreshTokenRecord);
        if (refreshTokenIsValid) {
        const permissions = [];
        const allPermissions =user.role.permissionsRoles;
        allPermissions.forEach((item) => {
          permissions.push(item.permission.name);
        });
          const loginUser = { id: user.id, name: user.name, role: user.role.name, login: user.login, permissions };
          const token = jwt.sign(loginUser, ACCESS_TOKEN, { expiresIn: `${ACCESS_TOKEN_EXPIRE}s` });

          //remove all records belong to this user
          await RefreshToken.destroy({where:{
            user_id:user.id
          }})

          const refreshToken = await RefreshToken.createToken(user.id);
          res.setHeader("token",`Bearer ${token}`);
          res.setHeader("refreshToken",refreshToken);
          req.user =loginUser
          next();
        }else{
          await RefreshToken.destroy({where:{
            user_id:user.id
          }})
          return res.sendError( 401, "Invalid Token Please Login Again");
        }
      }else{
        req.user = user;
        next();
      }
    });
  } catch (err) {
    return res.sendError();
  }
};
