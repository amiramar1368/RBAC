import { DataTypes } from "@sequelize/core";

import { sequelize } from "./db.js";
import { RolePermission } from "./role-permission.js";
import { Permission } from "./permission.js";

export const Role = sequelize.define(
  "role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  {
    timestamps: false,
  }
);

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
  otherKey: "permission_id",
  inverse: { type: "hasMany" },
});
