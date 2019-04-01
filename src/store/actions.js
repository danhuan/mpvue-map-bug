import types from './types'
export default {
  setUserInfoAction ({commit}, data) {
    commit(types.SET_USERINFO, {data})
  },
}
