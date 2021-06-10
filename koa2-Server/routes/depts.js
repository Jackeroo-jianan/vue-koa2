/**
 * 部门相关的路由
 */
 const router = require('koa-router')()
 const Dept = require('../models/deptSchema')
 const util = require('../utils/util')
 
 router.prefix('/dept')
 
 //=====获取部门列表/查询 的接口=====
 router.get('/list',async(ctx)=>{
    let{ deptName } = ctx.request.query
    let params = {}
    if(deptName){
        params.deptName = deptName
    }
    let rootList = await Dept.find(params)
    if (deptName) {
        ctx.body = util.success(rootList);
    } else {
        let treeList = getTreeDept(rootList, null, [])
        ctx.body = util.success(treeList)
    }
 })

 // 递归拼接树形列表
function getTreeDept(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
        let item = rootList[i]
        if (String(item.parentId.slice().pop()) == String(id)) {
            list.push(item._doc)
        }
    }
    list.map(item => {
        item.children = []
        getTreeDept(rootList, item._id, item.children)
        if (item.children.length == 0) {
            delete item.children;
        }
    })
    return list;
}

 //=====部门创建、编辑、删除的接口=====
 router.post('/operate',async(ctx)=>{
     const{ action,_id,...params } = ctx.request.body
     let res,info
     try {
        if (action == 'add'){
            res = await Dept.create(params)
            info = '创建成功'
        }else if(action == 'edit'){
            delete params._id
            params.updateTime = Date.now(); 
            res = await Dept.findByIdAndUpdate(_id, params)
            info = '编辑成功'
        }else{
            //删除结点时不仅删除它本身，也要删除它的全部子节点
            res = await Dept.findByIdAndRemove(_id)
            Dept.deleteMany({parentId:{$all:[_id]}})
            info = '删除成功'
        }
        ctx.body=util.success('',info)
     } catch (error) {
        ctx.body=util.fail(error.stack)
     }    
 })
 module.exports = router
 