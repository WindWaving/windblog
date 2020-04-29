const { Sequelize, sequelize } = require('./dbcommon')
const User=require('./user')
const Article=require('./article')
const Tag=require('./tag')
const ArticleTag=require('./article-tag')

Tag.belongsToMany(Article,{through:ArticleTag});
Article.belongsToMany(Tag,{through:ArticleTag});

User.hasMany(Article,{foreignKey:"author"});
Article.belongsTo(User,{foreignKey:"author"});

User.sync();
Tag.sync();
Article.sync();
// ArticleTag.sync();

module.exports={
    Sequelize,
    sequelize,
    Article,
    Tag,
    User,
}