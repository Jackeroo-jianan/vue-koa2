import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';
import request from './utils/request'
import storage from './utils/storage'
import './assets/style/index.scss';


const app = createApp(App)
console.log('环境变量：',import.meta.env)

//app.config.globalProperties可以用来挂载全局属性(Vue3)
app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;

app.use(router).use(store).use(ElementPlus).mount('#app')