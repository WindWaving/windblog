const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
// const users = require('./routes/users')
const article = require('./routes/api/doArticle')
const tags = require('./routes/api/doTag')
const user = require('./routes/api/doUser')
const date = require('./routes/api/doDate')
const code = require('./routes/api/code')
//跨域
const cors = require('@koa/cors')
//保存session
const session = require('koa-session')


// error handler
onerror(app)
//cors
app.use(cors({
  credentials: true,
  origin: ctx => ctx.header.origin, // web前端服务器地址
}));

app.keys = ['use username as session']

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));
//verify session for login
app.use(async (ctx, next) => {
  // ignore favicon
  if (ctx.path === '/favicon.ico') return;
  if (ctx.method.toUpperCase() == 'POST' && (ctx.path == '/api/user/login' || ctx.path == '/api/user/register')) {
    await next();
  } else if (ctx.method != 'GET' && !ctx.session.user) {
    console.log("用户未登录")
    ctx.body = {
      err: code.StateErr.errCode,
      info: code.StateErr.desc
    }
  } else {
    await next();
  }
});
// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
app.use(article.routes(), article.allowedMethods())
app.use(tags.routes(), tags.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(date.routes(), date.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
