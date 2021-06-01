/**
 * 环境配置封装
 */
 const env = import.meta.env.MODE || 'prod';
 const EnvConfig = {
     dev:{
         baseApi:'/api',
         mockApi:'https://www.fastmock.site/mock/c24f37ac92af0bad23723c748da04a25/vue-koa2'
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
     mock:false,
     namespace:'manager',
     
     //剩余参数，导出当前env的baseApi和mockApi
     ...EnvConfig[env]
 }