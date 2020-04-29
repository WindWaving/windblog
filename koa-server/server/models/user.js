const {Sequelize,sequelize}=require('./dbcommon')

const User=sequelize.define('user',{
    username:{
        type:Sequelize.STRING,
        primaryKey:true
    },
    password:{
        type:Sequelize.STRING,
    },
    role:{
        type:Sequelize.INTEGER,//0：普通用户；1：管理员
        defaultValue:0
    }
})

module.exports=User