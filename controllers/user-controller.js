import bcrypt from "bcrypt";
import { userValidator } from "../utils/input-validator.js";

export class UserController {
  static async fetchAllUsers(req, res) {
    console.log(10,req.user);
    try {
      const users = await req.models.User.findAll({
        include: [req.models.Role],
        attributes: ["id", "name", "login"],
      });
      res.status(200).json({ success: true, body: users, message: "All Users Fetch Successfully" });
    } catch (err) {
      res.sendError({ statusCode: 500, message: err.message });
    }
  }

  static async addUser(req, res) {
    try {
      await userValidator.validate(req.body, { abortEarly: false });
      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await req.models.User.create({ ...req.body, password: hashedPassword });
      res.status(201).json({
        success: true,
        body: user.id,
        message: "New User Add Successfully",
      });
    } catch (err) {
      //check validator error
      console.log(err);
      if (err.errors.length) {
        return res.sendError({ statusCode: 400, message: err.errors[0] });
      }
      return res.sendError({ statusCode: 500, message: err.message });
    }
  }
}
