const mongoose = require('mongoose')
const deptSchema = mongoose.Schema({
    "deptName": String,           //部门名称
    "userId": String,             //部门负责人编号
    "userName": String,           //部门负责人名称
    "userEmail": String,          //部门负责人邮箱
    "parentId": [mongoose.Types.ObjectId],  //自动生成的ID

    "updateTime": {                //更新时间
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model("depts", deptSchema, "depts")