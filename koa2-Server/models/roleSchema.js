const mongoose = require('mongoose')
const roleSchema =  mongoose.Schema({
    "roleName":String,   //角色名称
    "remark":String,     //备注
    "permissionList":{    //权限
        "checkedKeys":[],    //=>选中，按钮权限
        "halfCheckedKeys":[]  //=>半选中，非按钮权限(处理后)
    },
    "updateTime":{         //创建时间
        type:Date,
        default:Date.now()
    }, 
})

module.exports = mongoose.model('roles',roleSchema,'roles')