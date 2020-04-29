module.exports = {
    success: 0,

    postArticleErr: {
        errCode:1001,
        desc:"添加文章失败,"
    },
    postTagErr: {
        errCode: 1002,
        desc:"添加标签失败,"
    },
    postUserErr: {
        errCode: 1003,
        desc:"添加用户失败,"
    },
    registerErr:{
        errCode:1004,
        desc:"用户名已存在"
    },
    loginErr:{
        errCode:1005,
        desc:"用户未注册"
    },
    passwordErr:{
        errCode:1005,
        desc:"密码错误"
    },


    delArticleErr:{
        errCode:2001,
        desc:"删除用户失败,"
    },
    delTagErr:{
        errCode:2002,
        desc:"删除标签失败,"
    },
    delUserErr:{
        errCode:2003,
        desc:"删除用户失败"
    },
    

    putArticleErr:{
        errCode:3001,
        desc:"更新文章失败,"
    },
    putTagErr:{
        errCode:3002,
        desc:"更新标签失败,"
    },
    putUserErr:{
        errCode:3003,
        desc:"更新用户失败"
    },
    
    getArticleErr: {
        errCode: 4001,
        desc: "获取所有文章失败,"
    },
    getTagErr: {
        errCode:4002,
        desc:"获取所有标签失败,"
    },
    getUserErr: {
        errCode: 4003,
        desc:"获取所有用户失败,"
    },
    getArtTagErr:{
        errCode:4005,
        desc:"获取文章下标签失败,"
    },
    getTagArtsErr:{
        errCode:4006,
        desc:"获取标签下所有文章失败,"
    },
    getSinArticleErr:{
        errCode:4007,
        desc:"获取文章内容失败,"
    },
    getYearErr:{
        errCode:4008,
        desc:"获取年份下的文章失败,"
    },
    getYearMonErr:{
        errCode:4009,
        desc:"获取某年某月的文章失败,"
    },
    getYearsErr:{
        errCode:4010,
        desc:"获取年份失败,"
    },
    getMonsErr:{
        errCode:4011,
        desc:"获取月份失败,"
    },
    getLastestErr:{
        errCode:4012,
        desc:"获取最新文章失败,"
    },
    getUserArtsErr:{
        errCode:4013,
        desc:"获取用户的文章失败,"
    },


    ArticleAuthorErr: {
        errCode:6000,
        desc:"文章作者不存在"
    },
    StateErr:{
        errCode:6001,
        desc:"未登录状态"
    }

}