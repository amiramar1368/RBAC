export const userModel= (sequelize,{DataTypes})=>{
  const user = sequelize.define("user",{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    name:{
      type:DataTypes.STRING,
      set(value){
        this.setDataValue("name",value.trim())
      }
    },
    login:{
      type:DataTypes.STRING,
      unique:{
        msg:"login must be unique"
      },
      validate:{
        isShort(value){
          if(value.length<3){
            throw new Error("login must be at least 3 characters")
          }
        }
      }
    },
    password:DataTypes.STRING,
    role_id:DataTypes.INTEGER,
  },{
    timestamps:false
  })

  // sequelize.sync({alter:true})

  user.associate = models=>{
    user.belongsTo(models.Role,{foreignKey:{name:"role_id",onDelete:"NO ACTION", onUpdate:"CASCADE"}})
  }
  return user;
}