import { v4 as uuidv4 } from "uuid";
import {DataTypes} from '@sequelize/core';

import { REFRESH_TOKEN_EXPIRE } from "../config.js";
import {sequelize} from './db.js';
import {User} from './user.js';

 export const RefreshToken = sequelize.define(
    "refresh_token",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: DataTypes.STRING,
      expiryDate: DataTypes.DATE,
    },
    {}
  );

  RefreshToken.createToken = async (user_id) => {
    let expireAt = new Date();
    expireAt.setSeconds(expireAt.getSeconds() + Number(REFRESH_TOKEN_EXPIRE));
    const token = uuidv4();
    await RefreshToken.create({
      user_id,
      token,
      expiryDate: expireAt,
    });
    return token;
  };

  RefreshToken.checkExpiration = (token) => {
    return token.expiryDate > new Date();
  };

    RefreshToken.belongsTo(User, {
      foreignKey: { name: "user_id", onDelete: "NO ACTION", onUpdate: "CASCADE" },
    });
