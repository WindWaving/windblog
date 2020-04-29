var router = require('koa-router')();
const { Sequelize, sequelize, Tag, Article } = require("../../models")
const code = require('./code')
router.prefix('/api/tag')

//获取所有标签
router.get('/', async (ctx) => {
    let { offset, limit } = ctx.request.query
    try {
        let res = await Tag.findAndCountAll({
            offset: +offset,
            limit: +limit,
            order: [['id', 'desc']],
            distinct: true,
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
            err: code.getTagErr.errCode,
            info: code.getTagErr.desc + err
        }
    }
})

//添加标签
router.post('/', async (ctx) => {
    let tag = ctx.request.body;
    try {
        await Tag.create({
            labelname: tag.labename,
        })
        ctx.body = {
            err: code.success,
            info: "添加标签成功"
        }
    } catch (err) {
        ctx.body = {
            err: code.postTagErr.errCode,
            info: code.postTagErr.desc + err
        }
    }
})

//获取某标签下的所有文章
router.get('/:tagId/articles', async (ctx) => {
    let { tagId } = ctx.params
    let { offset, limit } = ctx.request.query;
    try {
        // let res=await Article.findAll({
        //     offset:+offset,
        //     limit:+limit,
        // })
        let res = await Tag.findAndCountAll({
            where: {
                id: tagId
            },
            offset: +offset,
            limit: +limit,
            attributes: ['labelname', 'id'],
            distinct:true,
            include: [
                {
                    model: Article,

                    include: [
                        {
                            model: Tag,
                            attributes: ['labelname'],
                            // required: true
                        }
                    ],
                }
            ],
            order: [[Article, 'date', 'desc']],
            subQuery: false

        })
        ctx.body = {
            err: code.success,
            info: {
                data:res.rows,
                pagination:{
                    total:res.count
                }
            }
        }
    } catch (err) {
        ctx.body = {
            err: code.getTagArtsErr.errCode,
            info: code.getTagArtsErr.desc + err
        }
    }
})

//删除标签
router.delete('/:id', async (ctx) => {
    let tagId = ctx.params.id;
    try {
        await Tag.destroy({
            where: {
                id: tagId
            }
        })
        ctx.body = {
            err: code.success,
            info: "删除标签成功"
        }
    } catch (err) {
        ctx.body = {
            err: code.delTagErr.errCode,
            desc: code.delTagErr.desc + err
        }
    }
})


//批量删除文章
router.post('/batch', async (ctx) => {
    let ids = ctx.request.body
    try {
        for (let key in ids) {
            await Tag.destroy({
                where: {
                    id: ids[key]
                }
            })
        }
        ctx.body = {
            err: code.success,
            info: "删除成功"
        }
    } catch (err) {
        ctx.body = {
            err: code.delTagErr.errCode,
            desc: code.delTagErr.desc + err
        }
    }

})

//更新标签
router.patch('/:id', async (ctx) => {
    let tagId = ctx.params.id;
    let tag = ctx.request.body;
    try {
        await Tag.update(tag, {
            where: { id: tagId }
        })
        ctx.body = {
            err: code.success,
            info: "更新标签成功"
        }
    } catch (err) {
        ctx.body = {
            err: code.putTagErr.errCode,
            info: code.putTagErr.desc + err
        }
    }
})
module.exports = router