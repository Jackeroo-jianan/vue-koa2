const mongoose = require('mongoose')
const menuSchema =  mongoose.Schema({
    
    "menuName": String,   //名称
    "menuType": Number,   //菜单类型：1 菜单 2按钮
    "menuState":Number,   //菜单状态：1 正常 2停用
    "path":String,        //路由地址
    "menuCode":String,    //权限标识    
    "parentId":[mongoose.Types.ObjectId],//父级_id
    
    
    "createTime":{         //创建时间
        type:Date,
        default:Date.now()
    }, 
    
    "lastLoginTime": {     //更新时间
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model('menu',menuSchema,'menus')