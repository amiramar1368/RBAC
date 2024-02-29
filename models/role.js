export const roleModel= (sequelize,{DataTypes})=>{
  const role = sequelize.define("role",{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    name:DataTypes.STRING,
  },{
    timestamps:false
  })


  role.associate = models=>{
    role.belongsToMany(models.Permission,{
      through:models.RolePermission,
      foreignKey:"role_id",
      otherKey:"permission_id",
      inverse:{type:"hasMany"}
    })
  }

  return role;
}