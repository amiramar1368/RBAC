import { Sequelize } from "@sequelize/core";

import { insertInitialData } from "../controllers/initial-data-controller.js";
import { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_DIALECT } from "../config.js";
import { userModel } from "./user.js";
import { permissionModel } from "./permission.js";
import { roleModel } from "./role.js";
import { rolePermissionModel } from "./role-permission.js";
import { RefreshTokenModel } from "./refresh-token.js";

const create_db = new Sequelize("", DB_USERNAME, DB_PASSWORD, {
  dialect: DB_DIALECT,
  timezone: "+03:30",
});

await create_db.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
let sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: DB_DIALECT,
  timezone: "+03:30",
});

const models = {
  Role: roleModel(sequelize, Sequelize),
  Permission: permissionModel(sequelize, Sequelize),
  RolePermission: rolePermissionModel(sequelize, Sequelize),
  User: userModel(sequelize, Sequelize),
  RefreshToken: RefreshTokenModel(sequelize, Sequelize),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

setTimeout(() => {
  insertInitialData();
}, 1000);

export { models };
