import bcrypt from "bcrypt";
import Redis from 'ioredis';

import {User} from '../models/user.js';
import {Role} from '../models/role.js';
import { userValidator } from "../utils/input-validator.js";
import {EXPIRE_REDIS_FETCHUSERS} from '../config.js';

export class UserController {
  static async fetchAllUsers(req, res) {
    try {
      const redis = new Redis();
      if(await redis.exists("fetchAllUsers")){
        const users =await redis.get("fetchAllUsers");
        return res.sendSuccess(200,"All Users Fetch Successfully" ,JSON.parse(users));
      }
      const users = await User.findAll({
        include: [Role],
        attributes: ["id", "name", "login"],
      });
      await redis.setex("fetchAllUsers",Number(EXPIRE_REDIS_FETCHUSERS),JSON.stringify(users))
      return res.sendSuccess(200,"All Users Fetch Successfully" ,users)
    } catch (err) {
      return res.sendError();
    }
  }

  static async addUser(req, res) {
    try {
      await userValidator.validate(req.body, { abortEarly: false });
      const {name,login,role_id, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name,login,role_id, password: hashedPassword });
      return res.sendSuccess(201,"New User Add Successfully",user.id)
    } catch (err) {
      //check validator error
      if (err.errors[0]?.type==="unique violation") {
        return res.sendError(400,err.message)
      }
      if (err.errors instanceof Array) {
        return res.sendError(400,[...err.errors])
      }
      return res.sendError()
    }
  }
}
