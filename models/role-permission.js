import { DataTypes } from "@sequelize/core";

import { sequelize } from "./db.js";

export const RolePermission = sequelize.define(
  "role_permission",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: DataTypes.INTEGER,
    permission_id: DataTypes.INTEGER,
  },
  {
    timestamps: false,
  }
);
