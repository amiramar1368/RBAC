export const rolePermissionModel= (sequelize,{DataTypes})=>{
  const rolePermission = sequelize.define("role_permission",{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    role_id:DataTypes.INTEGER,
    permission_id:DataTypes.INTEGER,
  },{
    timestamps:false
  })

  return rolePermission;
}