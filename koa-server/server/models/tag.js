const {Sequelize,sequelize,Article}=require("./dbcommon")

const Tag=sequelize.define("tag",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    labelname:{
        type:Sequelize.STRING,
        unique:true
    }
})

module.exports=Tag;