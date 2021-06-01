/*
axios二次封装
*/

import axios from 'axios'
import config from '../config/index'
import { ElMessage } from 'element-plus'
import router from './../router'
import storage from './storage'

const TOKEN_INVALID = 'Token认证失败'
const NETWORK_ERROR = '登录失败，网络连接错误'

//axios实例对象，添加全局的配置管理
const instance = axios.create({
    baseURL: config.baseApi,
    timeout: 5000,
});

//请求拦截
instance.interceptors.request.use((req) => {
    //TO-DO
    const headers = req.headers
    const { token } = storage.getItem('userInfo') || {}
    if (!headers.Authorization) {
        headers.Authorization = 'Bearer ' + token
    }
    return req;
})

//响应拦截
instance.interceptors.response.use((res) => {

    const { code, data, msg } = res.data;//接口返回的数据

    if (code === 200) {//登录成功，返回数据=====
        return data;
    } else if (code === 500001) {//登录失效======
        ElMessage.error(TOKEN_INVALID)
        setTimeout(() => {
            router.push('/login')//2s后返回登录界面
        }, 2000)
        return Promise.reject(TOKEN_INVALID)
    } else {                 //网络异常=======
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

//最终的封装函数
function request(options) {

    //method默认为GET请求
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {//兼容大小写

        //console.log('options.data==', options.data)
        options.params = options.data;//获取请求的data
    }

    let isMock = config.mock
    //未配置mock参数就采取全局(config/index.js下)
    if(typeof options.mock != 'undefined'){
        isMock = options.mock;
    }
    
    //确保生产环境下调用baseApi，加一层保险
     if(config.env === 'production'){
         instance.defaults.baseURL = config.baseApi
     }else{//通过在congfig文件里设置是否调用mock接口
        instance.defaults.baseURL = isMock ? config.mockApi : config.baseApi
     }

    //返回promise对象
    return instance(options)
}
['get', 'post', 'delete', 'put', 'patch'].forEach(item => {
    request[item] = (url, data, options) => {
        return request({
            url,
            data,
            method: item,
            ...options
        })
    }
});




export default request