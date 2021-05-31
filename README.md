# 2-登录功能
## 安装Mongo数据库
下载地址：https://www.mongodb.com/try/download/community<br>
## Mongodb安装配置
我参考的教程：https://blog.csdn.net/heshushun/article/details/77776706<br>
我的环境是windows 10 ，下载的最新版本，安装并不完全按照这个链接，不过过程是一致的
## userSchema结构
![image](https://github.com/Jackeroo-jianan/vue-koa2/blob/2-%E7%99%BB%E5%BD%95%E5%8A%9F%E8%83%BD/images/1622469795(1).png)
## Compass加入数据
![image](https://github.com/Jackeroo-jianan/vue-koa2/blob/2-%E7%99%BB%E5%BD%95%E5%8A%9F%E8%83%BD/images/1622470068(1).png)
## 登录方法实现
在数据库中插入相关文档后，前端传入用户名和密码，后端接收这两个字段，利用mongoose的findOne方法实现
