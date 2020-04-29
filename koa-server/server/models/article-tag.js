const{Sequelize,sequelize}=require('./dbcommon')

const ArticleTag=sequelize.define('article-tag',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    articleId:Sequelize.INTEGER,
    tagId:Sequelize.INTEGER
})

module.exports=ArticleTag