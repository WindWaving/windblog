import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const ArticleStore = {
  state: {
    articles: [],
    latest: [],
    yearMons: [], // [{year:xxx,months:[{month:xx},{month:xx}]}]
    curArt: {},
    pagination: {
      offset: 0,
      limit: 5,
      total: 0
    }
  },
  mutations: {
    initArticles (state) {
      state.articles = []
      state.pagination = {
        offset: 0,
        limit: 5,
        total: 0
      }
    },
    loadArticles (state, info) {
      state.articles = info.data
      state.pagination.total = info.pagination.total
    },
    loadMoreArts (state, info) {
      state.articles = state.articles.concat(info.data)
      state.pagination.total = info.pagination.total
    },
    loadClasses (state, info) {
      info.map((article) => {
        state.classes.push(article.date)
      })
    },
    loadYearMons (state, obj) {
      state.yearMons.push(obj)
    },

    loadArtById (state, info) {
      state.curArt = info
    },
    loadArtByTag (state, info) {
      state.articles = state.articles.concat(info.data[0].articles)
      state.pagination.total = info.pagination.total
    },
    loadArtByDate (state, info) {
      state.articles = state.articles.concat(info.data)
      state.pagination.total = info.pagination.total
    },
    loadLatest (state, info) {
      state.latest = info
    },
    clearDates (state) {
      state.yearMons = []
    }
  },
  actions: {
    delArticleBatch ({rootState, dispatch}, ids) {
      // let apiUrl = 'article/batch'
      // return dispatch('deleteBatch', { apiUrl, ids })
      let url = rootState.baseUrl + 'article/batch'
      let json = {}
      ids.map((val, index) => {
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
    delArticleAsync ({dispatch}, id) {
      let apiUrl = 'article/' + id
      return dispatch('deleteAsync', { apiUrl })
    },
    updateArticleAsync ({rootState}, data) {
      let url = rootState.baseUrl + 'article/' + data.id
      return axios({
        method: 'patch',
        url: url,
        data: data,
        withCredentials: true
      })
        .then((res) => {
          return res
        }).catch(err => {
          console.log(err)
        })
    },
    postArticleAsync ({rootState}, data) {
      let url = rootState.baseUrl + 'article'
      return axios({
        method: 'post',
        url: url,
        data: data,
        withCredentials: true
      })
        .then((res) => res)
        .catch(err => console.log(err))
    },
    loadArticlesAsync ({state, dispatch}, isMore) {
      let {offset, limit} = state.pagination
      let apiUrl = `article?offset=${offset}&limit=${limit}`
      let mutation = (isMore ? 'loadMoreArts' : 'loadArticles')
      return dispatch('loadAsync', {apiUrl, mutation})
    },
    loadArtByIdAsync ({dispatch}, id) {
      let apiUrl = 'article/' + id
      let mutation = 'loadArtById'
      dispatch('loadAsync', {apiUrl, mutation})
    },
    loadListByTagAsync ({state, dispatch}, payload) {
      let {id} = payload
      let {offset, limit} = state.pagination
      let apiUrl = `tag/${id}/articles?offset=${offset}&limit=${limit}`
      let mutation = 'loadArtByTag'
      dispatch('loadAsync', {apiUrl, mutation})
    },
    loadListByDateAsync ({state, dispatch, commit}, payload) {
      let {offset, limit} = state.pagination
      let {id} = payload
      let {year, month} = id
      let apiUrl = `date/${year}/${month}?offset=${offset}&limit=${limit}`
      let mutation = 'loadArtByDate'
      dispatch('loadAsync', {apiUrl, mutation})
    },
    loadLatestAsync ({dispatch}) {
      let apiUrl = 'date/latest'
      let mutation = 'loadLatest'
      dispatch('loadAsync', {apiUrl, mutation})
    },
    // 加载年份和每年下的月份
    loadYearsAsync ({dispatch, rootState}) {
      let url = rootState.baseUrl + 'date/years'
      axios.get(url).then((res) => {
        let {err, info} = res.data
        if (!err) {
          // 调用加载月份函数
          dispatch('loadMonsAsync', info)
        } else {
          throw new Error('服务器错误,' + err + ' : ' + info)
        }
      }).catch((err) => {
        console.log('error: ' + err)
      })
    },
    loadMonsAsync ({commit, rootState}, years) {
      years.map((item) => {
        let obj = {year: item.year, months: []}
        let url = rootState.baseUrl + `date/${obj.year}/months`
        axios.get(url).then((res) => {
          let {err, info} = res.data
          if (!err) {
            obj.months = info
            commit('loadYearMons', obj)
          } else {
            throw new Error('服务器错误,' + err + ' : ' + info)
          }
        }).catch((err) => {
          console.log('error: ' + err)
        })
      })
    },
    loadArtByUser ({state, dispatch}, username) {
      let {offset, limit} = state.pagination
      let apiUrl = `user/${username}/articles?offset=${offset}&limit=${limit}`
      let mutation = 'loadArticles'
      return dispatch('loadAsync', {apiUrl, mutation})
    }
  }
}

export default ArticleStore
