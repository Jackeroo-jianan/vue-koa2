# 2-登录功能
## 安装Mongo数据库
下载地址：https://www.mongodb.com/try/download/community<br>
## Mongodb安装配置
我参考的教程：https://blog.csdn.net/heshushun/article/details/77776706<br>
我的环境是windows 10 ，下载的最新版本，安装并不完全按照这个链接，不过过程是一致的
## userSchema结构
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
    <br>
    "createTime":{         //创建时间
        type:Date,
        default:Date.now()
    }, 
    
    "lastLoginTime": {     //更新时间
        type:Date,
        default:Date.now()
    }
## Compass向数据库加入数据
![image](https://github.com/Jackeroo-jianan/vue-koa2/blob/2-%E7%99%BB%E5%BD%95%E5%8A%9F%E8%83%BD/images/1622470068(1).png)
## 登录方法实现
    在前端vite.config中，设置代理进行前后端联调：
    export default defineConfig({
     server:{
         host:'localhost',
         port:8080,
      proxy:{ //前后端联调代理
        "/api":{
        target:"http://localhost:3000"
      }
       }
     },
    在数据库中插入相关文档后，前端传入用户名和密码，后端接收这两个字段，利用mongoose的findOne方法实现
