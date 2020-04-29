import Vue from 'vue'
import Router from 'vue-router'
import About from '@/pages/About'
import Home from '@/pages/Home'
import Article from '@/components/Article'
import ArticleList from '@/components/ArticleList'
import Admin from '@/pages/Admin'
import UpdateArticle from '@/pages/UpdateArticle'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/articlelist',
      children: [
        {
          path: '/articlelist',
          name: 'ArtileList',
          component: ArticleList
        },
        {
          path: '/article/:id',
          name: 'Article',
          component: Article
        }
      ]
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/update-article',
      name: 'UpdateArticle',
      component: UpdateArticle
    }
  ]
})
