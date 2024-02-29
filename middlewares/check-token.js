import jwt from "jsonwebtoken";

import { ACCESS_TOKEN } from "../config.js";

export default async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization?.split(" ")[1] || undefined;
    if (token == undefined) {
      return res.sendError({statusCode:401,messege:"UnAuthorized"})
    }
    await jwt.verify(token, ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res.sendError({statusCode:401,messege:"Invalid Token"});
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.sendError({statusCode:500,messege:err.messege});
  }
};
