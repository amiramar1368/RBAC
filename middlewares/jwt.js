import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Op } from "@sequelize/core";

import { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRE } from "../config.js";

export const setToken = async (req, res, next) => {
  const { login, password } = req.body;
  try {
    if (login == undefined || password == undefined) {
      return res.sendError(400, "login and password are required");
    }

    // you can use first manner or second
    // because we have to join some table,it's better to use stored procedure to improve performance.
    
    // first manner (suggested)
    // stored procedure defined in database 

    // mysql
    // DELIMITER //
    // CREATE PROCEDURE login (IN userLogin CHAR(20))
    // BEGIN
    // SELECT users.id AS id,users.name,users.login,users.password,roles.name AS role ,permissions.name AS permission FROM users INNER JOIN roles INNER JOIN permissions INNER JOIN role_permissions
    // ON users.role_id=roles.id AND roles.id=role_permissions.role_id AND
    // permissions.id=role_permissions.permission_id WHERE users.login=userLogin;
    // END //
    // DELIMITER ;
    // mysql
    
    // const loginUser = {};
    // const user = await req.models.sequelize.query("CALL login(:login)", {
    //   replacements: { login },
    // });
    // if (user.length > 0) {
    //   const passwordIsMatch = await bcrypt.compare(password, user[0].password);
    //   if (!passwordIsMatch) {
    //     return res.sendError(404, "login or password is wrong");
    //   }
    //   for (let i = 0; i < user.length; i++) {
    //     loginUser.id = user[i].id;
    //     loginUser.role = user[i].role;
    //     loginUser.login = user[i].login;
    //     loginUser.name = user[i].name;
    //     if (!loginUser.permissions) {
    //       loginUser.permissions = [];
    //     }
    //     loginUser.permissions.push(user[i].permission);
    //   }
    //   const token = jwt.sign(loginUser, ACCESS_TOKEN, { expiresIn: `${ACCESS_TOKEN_EXPIRE}s` });
    //   await req.models.RefreshToken.destroy({ where: { user_id: user[0].id } });
    //   const refreshToken = await req.models.RefreshToken.createToken(user[0].id);
    //   res.setHeader("token", `Bearer ${token}`);
    //   res.setHeader("refreshToken", refreshToken);
    //   req.loginUser = loginUser;
    //   next();
    // } else {
    //   return res.sendError(404, "User Not Found");
    // }
    //

    // second manner
    const user = await req.models.User.findOne({
      where: {
        login: {
          [Op.eq]: login,
        },
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
        return res.sendError(404, "login or password is wrong");
      }
      const permissions = [];
      const allPermissions = user.role.permissionsRoles;
      allPermissions.forEach((item) => {
        permissions.push(item.permission.name);
      });
      const loginUser = { id: user.id, name: user.name, role: user.role.name, login: user.login, permissions };
      const token = jwt.sign(loginUser, ACCESS_TOKEN, { expiresIn: `${ACCESS_TOKEN_EXPIRE}s` });
      await req.models.RefreshToken.destroy({ where: { user_id: user.id } });
      const refreshToken = await req.models.RefreshToken.createToken(user.id);
      res.setHeader("token", `Bearer ${token}`);
      res.setHeader("refreshToken", refreshToken);
      req.loginUser = loginUser;
      next();
    } else {
      return res.sendError(404, "User Not Found");
    }
    //
  } catch (err) {
    console.log(err);
    res.sendError();
  }
};
