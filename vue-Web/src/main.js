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

//app.directive创建一个全局vue指令
app.directive('has', {
    beforeMount: function (el, binding) {
        let actionList = storage.getItem('actionList');
        let value = binding.value;
        if (!(actionList.includes(value))) {
            el.style = 'display:none';
            setTimeout(() => {  //设为宏任务，可在渲染后执行
                el.parentNode.removeChild(el);
            }, 0)
        }
    }
})

//app.config.globalProperties可以用来挂载全局属性(Vue3)
app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;

app.use(router).use(store).use(ElementPlus, { size: 'small', zIndex: 3000 }).mount('#app')