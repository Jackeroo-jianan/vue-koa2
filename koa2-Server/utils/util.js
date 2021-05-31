/**
 * 通用工具函数
 */
 const log4js = require('./log4js')

 const CODE = {
     SUCCESS: 200,
     PARAM_ERROR: 10001, // 参数错误
     USER_ACCOUNT_ERROR: 20001, //账号或密码错误
     USER_LOGIN_ERROR: 30001, // 用户未登录
     BUSINESS_ERROR: 40001, //业务请求失败
     AUTH_ERROR: 500001, // 认证失败或TOKEN过期
 }
 module.exports = {
     
    //分页的功能
     pager({ pageNum = 1, pageSize = 10 }) {

        //把字符串
         pageNum *= 1;
         pageSize *= 1;

         //当前页开始的索引
         const skipIndex = (pageNum - 1) * pageSize;
         return {
             page: {
                 pageNum,
                 pageSize
             },
             skipIndex
         }
     },

     //成功的状态码
     success(data = '', msg = '', code = CODE.SUCCESS) {
         log4js.debug(data);
         return {
             code, data, msg
         }
     },

     //失败的状态码
     fail(msg = '', code = CODE.BUSINESS_ERROR, data = '') {
         log4js.debug(msg);
         return {
             code, data, msg
         }
     }
}