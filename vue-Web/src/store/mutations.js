
import storage from '../utils/storage'

export default{
    //登录后获取用户信息存入localstorage
    saveUserInfo(state,userInfo){
        state.userInfo = userInfo;
        storage.setItem('userInfo',userInfo)
    },
    //登录后获取用户可见菜单存入localstorage
    saveMenuList(state, menuList) {
        state.menuList = menuList;
        storage.setItem('menuList', menuList)
    },
    //登录后获取用户按钮权限存入localstorage
    saveActionList(state, actionList) {
        state.actionList = actionList;
        storage.setItem('actionList', actionList)
    },
}
