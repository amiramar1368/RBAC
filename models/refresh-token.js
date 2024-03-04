import { v4 as uuidv4 } from "uuid";

import { REFRESH_TOKEN_EXPIRE } from "../config.js";

export const RefreshTokenModel = (sequelize, { DataTypes }) => {
  const refreshToken = sequelize.define(
    "refresh_token",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: DataTypes.STRING,
      expiryDate: DataTypes.DATE,
    },
    {}
  );

  refreshToken.createToken = async (user_id) => {
    let expireAt = new Date();
    expireAt.setSeconds(expireAt.getSeconds() + Number(REFRESH_TOKEN_EXPIRE));
    const token = uuidv4();
    await refreshToken.create({
      user_id,
      token,
      expiryDate: expireAt,
    });
    return token;
  };

  refreshToken.checkExpiration = (token) => {
    return token.expiryDate > new Date();
  };

  //   refreshToken.sync({ alter: true });

  refreshToken.associate = (models) => {
    refreshToken.belongsTo(models.User, {
      foreignKey: { name: "user_id", onDelete: "NO ACTION", onUpdate: "CASCADE" },
    });
  };

  return refreshToken;
};
