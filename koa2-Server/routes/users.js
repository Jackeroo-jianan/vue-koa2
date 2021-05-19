/**
 * 用户管理相关的路由
 */
const router = require('koa-router')()
const User = require('./../models/userSchema')
const util = require('./../utils/util')

router.prefix('/users')

router.post('/login',async (ctx)=>{
  try {
    const { userName, userPwd } = ctx.request.body;
    const res = await User.findOne({
      userName,
      userPwd
    })
 
    if(res){
      data.token = token;
      ctx.body = util.success(data)
    }else{
      ctx.body = util.fail("用户名或密码不正确,请重新输入")
    }
  } catch (error) {
    ctx.body = util.fail(error.msg)
  }
})
module.exports = router
