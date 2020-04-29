const { Sequelize, sequelize } = require('./dbcommon')
var moment = require('moment');

const Article = sequelize.define('article', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.STRING,
    date: {
        type:Sequelize.DATE,
        get() {
            return moment(this.getDataValue('date')).format('YYYY-MM-DD');
          }
    },
    clickTimes: {
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    content: Sequelize.TEXT
}, {
    charset: 'utf8',
    collate: 'utf8_general_ci',//utf8编码
    timestamp: false//关闭自动添加的时间戳
})
module.exports = Article