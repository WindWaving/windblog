var router = require('koa-router')();
const { sequelize, Article, Tag, User } = require('../../models')
const code = require('./code')

router.prefix("/api/article")
//获取所有文章
router.get('/', async (ctx) => {
    let { offset, limit } = ctx.request.query
    try {
        // let res = await sequelize.query("SELECT id,title,author,date_format(date,'%Y-%m-%d') as date,clickTimes,content FROM `articles`")
        let res = await Article.findAndCountAll({
            offset: +offset,
            limit: +limit,
            order: [['date', 'desc']],
            distinct: true,
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
            err: code.getArticleErr.errCode,
            info: code.getArticleErr.desc + err
        }
    }
})
//添加新的文章
router.post('/', async (ctx) => {
    let article = ctx.request.body;
    if (!ctx.session.user) {
        console.log("没有登录", ctx.session.user)
    } else {
        console.log("登录了", ctx.session.user)

        try {
            let user = await User.findAll({ where: { username: article.author } })
            if (user.length > 0) {
                let piece = await Article.create({
                    title: article.title,
                    author: article.author,
                    date: article.date,
                    clickTimes: 0,
                    content: article.content
                })
                if (article.tags.length > 0) {
                    article.tags.map(async (tag) => {
                        try {
                            await sequelize.query(`insert into tags set labelname='${tag.labelname}'`)
                        } catch (err) { }
                        let label = await Tag.findOne({
                            where: { labelname: tag.labelname },
                            attributes: ['id']
                        })
                        //添加关联
                        await sequelize.query('insert into `article-tags` set articleId=' + piece.id + ',tagId=' + label.id)
                    })
                }

                ctx.body = {
                    err: code.success,
                    info: "添加文章成功" + article.tags + article.tags.length
                }
            } else {
                ctx.body = {
                    err: code.ArticleAuthorErr.errCode,
                    info: code.ArticleAuthorErr.desc
                }
            }
        } catch (err) {
            ctx.body = {
                err: code.postArticleErr.errCode,
                info: code.postArticleErr.desc + err
            }
        }
    }
})
//获取某篇文章
router.get('/:id', async (ctx) => {
    let articleId = ctx.params.id;
    try {
        let res = await Article.findOne({
            where: {
                id: articleId
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
        res.clickTimes++;
        await Article.update({ clickTimes: res.clickTimes }, {
            where: {
                id: articleId
            }
        });
        ctx.body = {
            err: code.success,
            info: res
        }
    } catch (err) {
        ctx.body = {
            err: code.getSinArticleErr.errCode,
            info: code.getSinArticleErr.desc + err
        }
    }
})

//获取某篇文章下的所有标签
router.get('/:id/tags', async (ctx) => {
    let articleId = ctx.params.id;
    try {
        let res = await Article.findAll({
            attributes: ['id'],
            where: {
                id: articleId
            },
            include: [{
                model: Tag,
                attributes: ['labelname'],
            },
            ]
        })
        ctx.body = {
            err: code.success,
            info: res
        }
    } catch (err) {
        ctx.body = {
            err: code.getArtTagErr.errCode,
            info: code.getArtTagErr.desc + err
        }
    }
})

//批量删除文章
router.post('/batch', async (ctx) => {
    let ids = ctx.request.body
    // let ids=ctx.params.ids
    try {
        for (let key in ids) {
            await Article.destroy({
                where: {
                    id: ids[key]
                }
            })
        }
        // ids.map(async(articleId) => {
        //     await Article.destroy({
        //         where: {
        //             id: articleId
        //         }
        //     })
        // })
        ctx.body = {
            err: code.success,
            ids: ids,
            info: "删除成功"
        }
    } catch (err) {
        ctx.body = {
            err: code.delArticleErr.errCode,
            desc: code.delArticleErr.desc + err + ids
        }
    }

})

//删除文章
router.delete('/:id', async (ctx) => {
    let articleId = ctx.params.id;
    try {
        await Article.destroy({
            where: {
                id: articleId
            }
        })
        ctx.body = {
            err: code.success,
            info: "删除成功"
        }
    } catch (err) {
        ctx.body = {
            err: code.delArticleErr.errCode,
            desc: code.delArticleErr.desc + err
        }
    }
})



//更新文章
router.patch('/:id', async (ctx) => {
    let articleId = ctx.params.id;
    let article = ctx.request.body;
    try {
        //更新文章
        await Article.update(article, {
            where: {
                id: articleId
            }
        })
        if (article.tags.length > 0) {
            //标签
            article.tags.map(async (tag) => {
                try {
                    await sequelize.query(`insert into tags set labelname='${tag.labelname}'`)
                } catch (err) { }
                let label = await Tag.findOne({
                    where: { labelname: tag.labelname },
                    attributes: ['id']
                })
                console.log("tagId", label.id)
                //更新关联
                await sequelize.query('insert into `article-tags` set articleId=' + articleId + ',tagId=' + label.id)
            })
        }

        ctx.body = {
            err: code.success,
            info: "更新文章成功"
        }

    } catch (err) {
        ctx.body = {
            err: code.putArticleErr.errCode,
            info: code.putArticleErr.desc
        }
    }
})

module.exports = router;