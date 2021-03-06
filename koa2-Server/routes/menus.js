/**
 * 菜单相关的路由
 */
const router = require('koa-router')()
const Menu = require('./../models/menuSchema')
const util = require('./../utils/util')

router.prefix('/menu')

//=====获取菜单列表/菜单查询 的接口=====
router.get('/list',async (ctx) =>{
    const { menuName, menuState } = ctx.request.query
    let params = {}

    if(menuName){params.menuName = menuName}
    if(menuState){params.menuState = menuState} //需要查询的字段是menuName和menuState

    let menuList = await Menu.find(params) || []
    if(params.menuName){                //如果是查询，不需要渲染递归树
        ctx.body = util.success(menuList)
    }else{
        const permissionList = util.getTreeMenu(menuList,null,[])
        ctx.body = util.success(permissionList) 
    }
    

})

//=====操作菜单的接口(新增/编辑/删除)=====
router.post('/operate', async (ctx) => {
    const { _id, action, ...params } = ctx.request.body;
    console.log(_id,action)
    let res, info
    try {
        if (action == 'add') {        //新增菜单
            res = await Menu.create(params)
            info = '创建成功'
            
        } else if (action == 'edit') {   //编辑菜单
            params.updateTime = new Date()
            res = await Menu.findByIdAndUpdate(_id,params)
            info = '编辑成功'
        } else {
            res = await Menu.findByIdAndDelete(_id) //删除菜单
            Menu.deleteMany({parentId:{ $all:[_id] } } )//注意：删除菜单需要同时删除目标的子菜单
            info = '删除成功'
        }
        ctx.body = util.success({},info)
    } catch (error) {
        ctx.body = util.fail(error.stack)
    }



})

module.exports = router
