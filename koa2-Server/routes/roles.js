/**
 * 角色相关的路由
 */
 const router = require('koa-router')()
 const Role = require('./../models/roleSchema')
 const util = require('./../utils/util')
 
 router.prefix('/roles')
 
 //=====获取角色列表(全部) 的接口=====
 router.get('/allList',async (ctx) =>{  
    try {
        const list = await Role.find({},"_id roleName")
        ctx.body = util.success(list,'角色列表获取成功')
    } catch (error) {
        ctx.body = util.fail(`查询失败：${error}`)
    }
    })
 
 //=====获取角色列表渲染页面(包括页面) 的接口=====
 router.get('/list',async (ctx) =>{  
    const { roleName } = ctx.request.query
    const { page,skipIndex } = util.pager(ctx.request.query)
    try {
        let params = {}
        if (roleName){params.roleName = roleName}
        const query = Role.find(params)
        const list = await query.skip(skipIndex).limit(page.pageSize)//skip=>指定跳过的文档条数;limit=>指定查询结果的最大条数。查询当前页
        const total = await Role.countDocuments(params)//总条数
        ctx.body = util.success({
            list,page:{...page,total}
        })
    } catch (error) {
        ctx.body = util.fail(`加载失败${error.stack}`)
    }
 })

// =====角色操作：创建、编辑和删除的接口=====
router.post('/operate', async (ctx) => {
    const { _id, roleName, remark, action } = ctx.request.body;
    let res, info;
    try {
      if (action == 'add') {
        res = await Role.create({ roleName, remark })
        info = "创建成功"
      } else if (action == 'edit') {
        if (_id) {
          let params = { roleName, remark }
          params.updateTime = Date.now();
          res = await Role.findByIdAndUpdate(_id, params)
          info = "编辑成功"
        } 
      } else {
        if (_id) {
          res = await Role.findByIdAndRemove(_id)
          info = "删除成功"
        } 
      }
      ctx.body = util.success(res, info)
    } catch (error) {
      ctx.body = util.fail(error.stack)
    }
  })

// =====设置角色权限的接口=====
// 权限设置
router.post('/update/permission', async (ctx) => {
  const { _id, permissionList } = ctx.request.body;
  try {
    let params = { permissionList, update: new Date() }
    await Role.findByIdAndUpdate(_id, params)
    ctx.body = util.success('', "权限设置成功")
  } catch (error) {
    ctx.body = util.fail("权限设置失败")
  }
})
 module.exports = router
 