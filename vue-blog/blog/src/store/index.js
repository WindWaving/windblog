import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import ArticleStore from './ArticleStore'
import TagStore from './TagStore'
import UserStore from './UserStore'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Vuex)
Vue.use(Element)

const store = new Vuex.Store({
  state: {
    isSignIn: false,
    isEdit: false, // 是否正在编辑文章
    baseUrl: 'http://localhost:3000/api/'
  },
  mutations: {
    setIsEdit (state, flag) {
      state.isEdit = flag
    },
    // 下一页
    goNext (state, pagination) {
      console.log('go next', pagination.total)
      pagination.offset = pagination.offset + pagination.limit
    },
    // 设置某个状态的pagination
    setPagination (state, payload) {
      let {oldPag, newPag} = payload
      for (let key in newPag) {
        oldPag[key] = newPag[key]
      }
    },
    // 判断是否登录
    setState (state, info) {
      console.log(info)
      if (info.sess != null) {
        state.isSignIn = true
      } else {
        state.isSignIn = false
      }
    }
  },
  actions: {
    /**
     * delete data in batch
     * param:data is typeof array
     */
    deleteBatch ({state}, {apiUrl, data}) {
      let url = state.baseUrl + apiUrl
      let json = {}
      data.map((val, index) => {
        json[index] = val.id
      })
      return axios({
        method: 'post',
        url: url,
        data: json,
        withCredentials: true
      })
        .then(res => res)
        .catch(err => console.log(err))
    },

    /**
     * delete single data
     */
    deleteAsync ({state}, {apiUrl}) {
      let url = state.baseUrl + apiUrl
      return axios({
        method: 'delete',
        url: url,
        withCredentials: true
      })
        .then(res => res)
        .catch(err => console.log(err))
    },
    checkStateAsync ({dispatch}) {
      let apiUrl = 'user/state'
      let mutation = 'setState'
      return dispatch('loadAsync', {apiUrl, mutation})
    },
    logoutAsync ({dispatch}) {
      let apiUrl = 'user/logout'
      let mutation = 'setState'
      return dispatch('loadAsync', {apiUrl, mutation})
    },
    loginAsync ({state, commit}, payload) {
      let {url, data} = payload
      let apiUrl = state.baseUrl + `user/${url}`
      return axios({
        url: apiUrl,
        method: 'post',
        data: data,
        withCredentials: true
      }).then((res) => {
        if (!res.data.err) {
          commit('setState', res.data.info)
        }
      })
    },
    /**
     *
     * @param {*} param0 :context
     * @param {*} apiUrl :eg:'article'
     * @param {*} mutation :mutation method
     */
    loadAsync ({state, commit}, {apiUrl, mutation}) {
      let url = state.baseUrl + apiUrl
      axios({
        method: 'get',
        url: url,
        withCredentials: true
      }).then((res) => {
        let {err, info} = res.data
        if (!err) {
          commit(mutation, info)
        } else {
          throw new Error('服务器错误' + err + ' : ' + info)
        }
      }).catch((err) => {
        console.log('error: ' + err)
      })
    }
  },
  modules: {
    MArticle: ArticleStore,
    MTag: TagStore,
    MUser: UserStore
  }
})

export default store
