/**
 * 用户管理相关的路由
 */
const router = require('koa-router')()
const User = require('./../models/userSchema')
const util = require('./../utils/util')
const jwt = require('jsonwebtoken')
router.prefix('/users')

//向数据库验证用户账号和密码
router.post('/login', async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body;
    /**
     * Mongo返回数据库指定字段，有三种方式
     * 1. 'userId userName userEmail state role deptId roleList' 字符串，空格分开
     * 2. {userId:1,_id:0}  对象方式：0不返回，1返回
     * 3. select('userId') select选择器
     */
    const res = await User.findOne({
      userName,
      userPwd
    },'userId userName userEmail state role deptId roleList')
    
    if (res) {//res存在，把附带token的响应发给前端
    const data = res._doc;
    console.log('data=====',data)
    
    //jwt生成token
    const token = jwt.sign({
      data  //token数据,注：实际为data:data;根据ES6语法key=value时缩写
    }, 'imooc', //密钥
     { expiresIn: '1h' }) //过期时间

      data.token = token;
      ctx.body = util.success(data)
    } else {//否则提示错误
      ctx.body = util.fail("用户名或密码不正确,请重新输入")
    }
  } catch (error) {
    ctx.body = util.fail(error.msg)
  }
})
module.exports = router
