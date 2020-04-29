const UserStore = {
  state: {
    users: [],
    pagination: {
      offset: 0,
      limit: 5,
      total: 0
    }
  },
  mutations: {
    loadUser (state, info) {
      state.users = info.data
      state.pagination.total = info.pagination.total
    }
  },
  actions: {
    loadUserAsync ({state, dispatch}) {
      let {offset, limit} = state.pagination
      let apiUrl = `user?offset=${offset}&limit=${limit}`
      let mutation = 'loadUser'
      return dispatch('loadAsync', {apiUrl, mutation})
    }
  }
}

export default UserStore
