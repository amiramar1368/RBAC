import bcrypt from "bcrypt";
import { userValidator } from "../utils/input-validator.js";

export class UserController {
  static async fetchAllUsers(req, res) {
    try {
      const users = await req.models.User.findAll({
        include: [req.models.Role],
        attributes: ["id", "name", "login"],
      });
      return res.sendSuccess(200,"All Users Fetch Successfully" ,users)
    } catch (err) {
      return res.sendError();
    }
  }

  static async addUser(req, res) {
    try {
      await userValidator.validate(req.body, { abortEarly: false });
      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await req.models.User.create({ ...req.body, password: hashedPassword });
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
