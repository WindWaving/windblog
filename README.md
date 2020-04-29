# windblog
> 使用Vue作为前端和Koa2作为后端的个人博客网站项目
> 网站有三种用户：未登录用户，普通登录用户和管理员。未登录用户只能浏览文章，普通用户具有浏览文章和管理自己发布的文章的权限，管理员具有管理所有的文章，标签和用户的权限，但管理员不能编辑文章。

> a personal blog project with vue and koa
> There are three kinds of users: user not logged in,regular user and super user(administrator). 
> User not logged in permission: view articles.
> Regular user permission: view articles and manage their posted articles.
> Super user permission: manage all the articles, tags and users(not edit)

### Table of contents
- [Install](#install)
- [Code](#code)

### <span id="install">Install</span>
- **server**
```
git clone https://github.com/WindWaving/windblog.git
cd koa-server/server`
npm start
```
- **blog**
```
cd vue-blog/blog
npm run dev
```

### <span id="code">Code</span>
#### directories
- **server**
koa-server/server/
`models`----- Database tables definition
`routes/api`----- APIs definition (RESTFUL api)
- **blog**
vue-blog/blog/src/
`store`----- State management(Vuex)
`pages`----- routers
`components`----- components for pages
#### For use
modify `baseUrl: 'http://localhost:3000/api/'`(koa server default port) in `vue-blog/blog/store/index.js` to your configured address
#### Main technologies and modules
- server: koa2
- database operations: sequelize & mysql2
- encrypt password: crypto
- blog: vue
- state management: vuex
- UI components: element-ui
- communication: axios
- session: koa-session & vue-session