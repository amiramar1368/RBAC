import { Sequelize } from "@sequelize/core";

import { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_DIALECT } from "../config.js";

const create_db = new Sequelize("", DB_USERNAME, DB_PASSWORD, {
  dialect: DB_DIALECT,
  timezone: "+03:30",
});

await create_db.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: DB_DIALECT,
  timezone: "+03:30",
});

