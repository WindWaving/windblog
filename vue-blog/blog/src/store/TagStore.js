import axios from 'axios'

const TagStore = {
  state: {
    tags: [],
    pagination: {
      offset: 0,
      limit: 5,
      total: 0
    }
  },
  mutations: {
    initTags (state) {
      state.tags = []
      state.pagination = {
        offset: 0,
        limit: 5,
        total: 0
      }
    },
    loadMoreTags (state, info) {
      state.tags = state.tags.concat(info.data)
      state.pagination.total = info.pagination.total
    },
    loadTags (state, info) {
      state.tags = info.data
      state.pagination.total = info.pagination.total
    }
  },
  actions: {
    loadTagsAsync ({ state, dispatch }, isMore) {
      let { offset, limit } = state.pagination
      let apiUrl = `tag?offset=${offset}&limit=${limit}`
      let mutation = (isMore ? 'loadMoreTags' : 'loadTags')
      return dispatch('loadAsync', {apiUrl, mutation})
    },

    delTagAsync ({ dispatch }, id) {
      let apiUrl = 'tag/' + id
      return dispatch('deleteAsync', { apiUrl })
    },
    delTagBatch ({ rootState }, ids) {
      // let apiUrl = 'tag/batch'
      // return dispatch('deleteBatch', { apiUrl, ids })
      let url = rootState.baseUrl + 'tag/batch'
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
    }
  }
}

export default TagStore
// module.exports = TagStore
