const Sequelize = require('sequelize');

const sequelize = new Sequelize('windblog', 'root', 'usbw', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3307,
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    },
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    },
    timezone: '+08:00' //改为标准时区
});

module.exports = {
    Sequelize,
    sequelize
}