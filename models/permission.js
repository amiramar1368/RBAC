export const permissionModel= (sequelize,{DataTypes})=>{
  const permission = sequelize.define("permission",{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    name:DataTypes.STRING,
  },{
    timestamps:false
  })

  return permission;
}