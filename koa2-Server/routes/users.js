/**
 * 用户管理相关的路由
 */
const router = require('koa-router')()
const User = require('./../models/userSchema')
const util = require('./../utils/util')
const jwt = require('jsonwebtoken')
const counter = require('../models/counterSchema')
const md5 = require('md5')

router.prefix('/users')

//=====登录验证的接口=====
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

//=====查询用户/获取用户信息(包括分页) 的接口=====
router.get('/list',async (ctx)=>{
  const{ userName,userId,state } = ctx.request.query
  const { page,skipIndex } = util.pager(ctx.request.query)

  let params = {}
  if(userName){ params.userName = userName }
  if(userId) { params.userId = userId }
  if(state && state!='0') { params.state = state }//需要查询的字段是userName和userId和state

  const query = User.find(params,{_id:0,userPwd:0})//查询符合的数据并返回，过滤掉_id和userPwd
  const list = await query.skip(skipIndex).limit(page.pageSize)//skip=>指定跳过的文档条数;limit=>指定查询结果的最大条数。查询当前页
  const total = await User.countDocuments(params)//总条数

  ctx.body = util.success({
    page:{
      ...page,
      total
    },
    list
  })
})

//=====用户信息删除的接口=====
router.post('/delete',async(ctx)=>{
  const { userIds } = ctx.request.body//获取要删除的用户ID(已存入数组)
  const res = await User.updateMany({userId:{ $in:userIds}},{state:3})//软删除:将Mongo数据库中userId属性值包含于userIds数组内的值的所有文档的state更新为3
  if(res.nModified)  {
    ctx.body = util.success(res,`${res.nModified}条数据已经被成功删除`)
    return
  }
  ctx.body = util.fail('删除失败')
})

//=====用户新增/编辑的接口=====
router.post('/operate',async(ctx)=>{
  const {userId,userName,userEmail,job,state,mobile,roleList,deptId,action} = ctx.request.body  //编辑/新增 时需要接收的字段
  
  //新增用户
  if (action == 'add'){
    if(!userName||!userEmail||!mobile||!deptId){
      ctx.body = util.fail('信息不足，无法创建')
      return
    }
    
    //判断不能重复注册(用户名邮箱不可重复使用)
    const res = await User.findOne({$or:[{userName},{userEmail}]},'_id userName userEmail')
   
    if(res){
      ctx.body = util.fail('用户名或邮箱已注册')
    }else{

    //查询数据库counters中存在_id:'userId'的文档，把它的sequence_value加1并返回新文档
    const doc = await counter.findOneAndUpdate({_id:'userId'},{$inc:{sequence_value:1}},{new:true})
      
    try {
        const user = new User({
          userId:doc.sequence_value,
          userName,
          userPwd:md5('123'),
          userEmail,
          role:1,
          roleList,
          mobile,
          job,
          state,
          deptId,
        })
        user.save();
        ctx.body=util.success({},'用户创建成功')
      } catch (error) {
        ctx.body = util.fail('','用户创建失败')
      }
      
    }
  }
  //编辑用户
  else{
    if(!userName||!userEmail||!mobile||!deptId){
      ctx.body = util.fail('信息不足，无法编辑')
      return
    }
    try {
      //查询数据库user中存在userId属性的文档，把它的目标属性更新到文档
      const res = await User.findOneAndUpdate({userId},{userName,userEmail,job,state,mobile,roleList,deptId})
      ctx.body = util.success(res,'更新成功')
      return
    } catch (error) {
      ctx.body = util.fail('更新失败')
    }   
}
})

module.exports = router
