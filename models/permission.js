import {DataTypes} from '@sequelize/core';

import {sequelize} from './db.js';

export const Permission = sequelize.define("permission",{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    name:DataTypes.STRING,
  },{
    timestamps:false
  })