import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const option = {
  state,
  getters,
  actions,
  mutations,
  modules: {
    
  },
}
export default new Vuex.Store(option)
