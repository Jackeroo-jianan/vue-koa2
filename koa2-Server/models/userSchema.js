const mongoose = require('mongoose')
const userSchema =  mongoose.Schema({

    "userId": Number,      //用户ID，自增长
    "userName": String,    //名称
    "userPwd": String,     //密码
    "userEmail": String,   //邮箱
    "mobile": Number,      //手机号
    "sex": Number,         //性别 0:男  1：女 
    "deptId": [],          //所属部门
    "job": String,         //岗位
    
    "state":{              // 1:在岗  2: 实习 3: 离职
        type:Number,
        default:1
    } ,          
    
    "role": {               // 权限 0：会员  1： 普通用户
        type:Number,
        default:1
    },          
    "roleList": [],        //系统角色，ex:运维，测试，开发···，可多选择
    
    "createTime":{         //创建时间
        type:Date,
        default:Date.now()
    }, 
    
    "lastLoginTime": {     //更新时间
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model('users',userSchema,'users')