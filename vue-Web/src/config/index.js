/**
 * 环境配置封装
 */
 const env = import.meta.env.MODE || 'dev';
 const EnvConfig = {
     dev:{
         baseApi:'/',
         mockApi:'https://www.fastmock.site/mock/0cef6532d33d0cf1e1fe63664b0b4c09/manager'
     },
     test:{
         baseApi:'//test.futurefe.com/api',
         mockApi:'https://www.fastmock.site/mock/0cef6532d33d0cf1e1fe63664b0b4c09/manager'
     },
     production:{
         baseApi:'//futurefe.com/api',
         mockApi:'https://www.fastmock.site/mock/0cef6532d33d0cf1e1fe63664b0b4c09/manager'
     }
 }
 export default {
     env,
     mock:true,
     namespace:'manager',
     
     //剩余参数，导出当前env的baseApi和mockApi
     ...EnvConfig[env]
 }