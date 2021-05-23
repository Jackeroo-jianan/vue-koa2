
import storage from '../utils/storage'

export default{
    //登录后获取用户信息存入localstorage
    saveUserInfo(state,userInfo){
        state.userInfo = userInfo;
        storage.setItem('userInfo',userInfo)
    }
}
