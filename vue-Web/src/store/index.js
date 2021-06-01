import Vuex from 'vuex'
import mutations from './mutations'
import storage from '../utils/storage'

const state = {
    userInfo:"" || storage.getItem("userInfo")
}

export default Vuex.createStore({
    state,
    mutations
  })
  