import types from './types'

export default {
  [types.SET_USERINFO] (state, payload) {
    state.sUserInfo = Object.assign(state.sUserInfo, payload.data)
  }
}
