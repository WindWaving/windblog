var router = require('koa-router')();
const { Sequelize,sequelize,Article,Tag,User} = require('../../models')
const code = require('./code')
const Op=Sequelize.Op

router.prefix("/api/date")


//获取所有年份
router.get('/years',async(ctx)=>{
    try{
        // 第一个对象是结果对象，第二个是元数据对象（包含受影响的行等） - 但在mysql中，这两个是相等的
        let res=await sequelize.query(`SELECT distinct(YEAR(date)) as year FROM articles`, { type: Sequelize.QueryTypes.SELECT })
        console.log(res)
        ctx.body={
            err:code.success,
            info:res
        }
    }catch(err){
        ctx.body={
            err:code.getYearsErr.errCode,
            info:code.getYearsErr.desc+err
        }
    }
})


//获取所有月份
router.get('/:year/months',async(ctx)=>{
    let {year}=ctx.params
    try{
        let res=await sequelize.query(`SELECT DISTINCT(MONTH(date)) as month FROM articles WHERE date like '%${year}%'`, { type: Sequelize.QueryTypes.SELECT })
        ctx.body={
            err:code.success,
            info:res
        }
    }catch(err){
        ctx.body={
            err:code.getMonsErr.errCode,
            info:code.getMonsErr.desc+err
        }
    }
})
//获取某年的文章
router.get('/year/:year',async(ctx)=>{
    let year=ctx.params.year;
    try{
        let res=await sequelize.query(`SELECT * FROM articles WHERE date>='${year}-01-01' and date<'${+year+1}-01-01'`, { type: Sequelize.QueryTypes.SELECT })
        ctx.body={
            err:code.success,
            info:res
        }
    }catch(err){
        ctx.body={
            err:code.getYearErr.errCode,
            info:code.getYearErr.desc+err
        } 
    }
})

//获取某年某月的文章
router.get('/:year/:month',async(ctx)=>{
    let {year,month}=ctx.params;
    let {offset,limit}=ctx.request.query
    try{
        let res=await Article.findAndCountAll({
            offset:+offset,
            limit:+limit,
            order:[['date','desc']],
            distinct:true,
            where:{
                [Op.and]:[
                    {date:{[Op.gte]:`${+year}-${+month}-01`}},
                    {date:{[Op.lt]:`${+year}-${+month+1}-01`}}
                ]
            },
            include:[
                {
                    model:User,
                    attributes:['username']
                },
                {
                    model:Tag,
                    attributes:['labelname']
                }
            ]
        })
        ctx.body={
            err:code.success,
            info:{
                data:res.rows,
                pagination:{
                    total:res.count
                }
            }
        }
    }catch(err){
        ctx.body={
            err:code.getYearMonErr.errCode,
            info:code.getYearMonErr.desc+err
        }
    }
})

//获取最新文章
router.get('/latest',async(ctx)=>{
    try{
        let res=await Article.findAll({
            attributes:['id','title'],
            order: [['date','desc']],
            limit:4
        })
        ctx.body={
            err:code.success,
            info:res
        }
    }catch(err){
        ctx.body={
            err:code.getLastestErr.errCode,
            info:code.getLastestErr.desc
        }  
    }

    
})
module.exports=router