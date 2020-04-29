var router = require('koa-router')();

router.get('/', async (ctx, next) => {
  await ctx.render({
    title:"hi,there"
  })
})
module.exports = router;
