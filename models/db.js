import { Sequelize } from "@sequelize/core";

import { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_DIALECT } from "../config.js";
import { userModel } from "./user.js";
import { permissionModel } from "./permission.js";
import { roleModel } from "./role.js";
import { rolePermissionModel } from "./role-permission.js";

const create_db = new Sequelize("", DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
let sequelize;
try {
  await create_db.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
  sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
} catch (error) {
    process.exit()
}

const models = {
  Role: roleModel(sequelize, Sequelize),
  Permission: permissionModel(sequelize, Sequelize),
  RolePermission: rolePermissionModel(sequelize, Sequelize),
  User: userModel(sequelize, Sequelize),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export { models };
