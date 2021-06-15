import Vuex from 'vuex'
import mutations from './mutations'
import storage from '../utils/storage'

const state = {
    userInfo: storage.getItem("userInfo") || {},
    menuList: storage.getItem("menuList") || {},
    actionList: storage.getItem("actionList") || {},

}

export default Vuex.createStore({
    state,
    mutations
  })
  