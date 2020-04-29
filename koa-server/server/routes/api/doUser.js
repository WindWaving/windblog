var router = require('koa-router')();
const { Sequelize, sequelize, User, Article,Tag } = require('../../models')
const code = require('./code')
const crypto = require("crypto");
router.prefix("/api/user")


router.get('/state', ctx => {
    ctx.body = {
        err: code.success,
        info: {
            sess: ctx.session.user
        }
    }
})
//获取所有用户
router.get('/', async (ctx) => {
    let { offset, limit } = ctx.request.query
    try {
        let res = await sequelize.query(`select username,users.createdAt,count(author) as counts, role from articles right join users on author=username group by username order by users.createdAt desc limit ${offset},${limit}`, { type: Sequelize.QueryTypes.SELECT })
        // let total=await sequelize.query(`select count(*) as total from users`,{ type: Sequelize.QueryTypes.SELECT})
        let total = await User.findAndCountAll({
            distinct: true,
        });
        ctx.body = {
            err: code.success,
            info: {
                data: res,
                pagination: {
                    total: total.count
                }
            }
        }
    } catch (err) {
        ctx.body = {
            err: code.getUserErr.errCode,
            info: code.getUserErr.desc + err
        }
    }
})

//用户登录
router.post('/login', async (ctx) => {
    let { username, password, role } = ctx.request.body;
    try {
        let res = await User.findOne({
            where: {
                username: username,
                role: role
            }
        })
        if (!res) {
            ctx.body = {
                err: code.loginErr.errCode,
                info: code.loginErr.desc
            }
        } else {
            //密码加密比较
            let md5 = crypto.createHash("md5");
            let hashPswd = md5.update(password).digest("hex");
            if (res.password !== hashPswd) {
                ctx.body = {
                    err: code.passwordErr.errCode,
                    info: code.passwordErr.desc
                }
            } else {
                //保存用户登录状态
                ctx.session.user = res.username
                ctx.body = {
                    err: code.success,
                    info: {
                        sess: ctx.session.user,
                        role: role
                    }
                }
            }
        }
        console.log("登录用户", ctx.session.user)
    } catch (err) {
        ctx.body = {
            err: code.getUserErr.errCode,
            info: code.getUserErr.desc + err
        }
    }
})

//用户登出
router.get('/logout', ctx => {
    ctx.session.user = null
    ctx.body = {
        err: code.success,
        info: {
            sess: ctx.session.user
        }
    }
})

//添加用户
router.post('/register', async (ctx) => {
    let { username, password, role } = ctx.request.body;
    try {
        let res = await User.findAll({
            where: { username: username }
        });
        if (res.length != 0) {
            ctx.body = {
                err: code.registerErr.errCode,
                info: code.registerErr.desc
            }
        } else {
            //加密密码
            let md5 = crypto.createHash("md5");
            let hashPswd = md5.update(password).digest("hex");
            await User.create({
                username: username,
                password: hashPswd,
                role: role
            })
            //保存用户登录状态
            ctx.session.user = username
            ctx.body = {
                err: code.success,
                info: {
                    sess: ctx.session.user,
                    role: role
                }
            }
        }
    } catch (err) {
        ctx.body = {
            err: code.postUserErr.errCode,
            info: code.postUserErr.desc + err
        }
    }
})

router.get('/logout', async (ctx) => {
    ctx.session.user = null
    ctx.body = {
        err: code.success,
        info: {
            sess: ctx.session.user
        }
    }
})
//删除用户
router.delete('/:username', async (ctx) => {
    let { username } = ctx.params;
    try {
        await User.destroy({
            where: { username: username }
        })
        ctx.body = {
            err: code.success,
            info: "删除用户成功"
        }
    } catch (err) {
        ctx.body = {
            err: code.delUserErr.errCode,
            info: code.delUserErr.desc + err
        }
    }
})

//更新用户
router.patch('/:username', async (ctx) => {
    let { username } = ctx.params;
    let user = ctx.request.body;
    try {
        await User.update(user, {
            where: { username: username }
        })
        ctx.body = {
            err: code.success,
            info: "更新用户成功"
        }
    } catch (err) {
        ctx.body = {
            err: code.putUserErr.errCode,
            info: code.putUserErr.desc + err
        }
    }
})

//用户的文章
router.get('/:username/articles', async (ctx) => {
    let { username } = ctx.params
    let { offset, limit } = ctx.request.query
    try {
        let res = await Article.findAndCountAll({
            offset: +offset,
            limit: +limit,
            order: [['date', 'desc']],
            distinct: true,
            where:{
                author:username
            },
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Tag,
                    attributes: ['labelname']
                }
            ]
        });
        // let res = await Article.findAndCountAll({
        //     where: {
        //         author: username
        //     },
        //     limit: +limit,
        //     offset: +offset,
        //     distinct: true
        // })
        ctx.body = {
            err: code.success,
            info: {
                data: res.rows,
                pagination: {
                    total: res.count
                }
            }
        }
    } catch (err) {
        ctx.body = {
            err: code.getUserArtsErr.errCode,
            info: code.getUserArtsErr.desc+err
        }
    }
})
module.exports = router