# 1-前后端环境搭建
## 前端环境搭建
###  安装node环境
官方文档http://nodejs.cn/<br>
建议安装最新版本<br>
### 通过vite初始化项目
官方文档：<br>
https://cn.vitejs.dev/<br><br>
### 创建命令：<br>
npm init @vitejs/app xxx<br><br>
### 项目初始化<br>
npm init<br><br>
### 配置必须的插件
如vuex,vue-router,element-plus，axios，sass等,只有sass添加在开发环境下<br>
npm add sass -D<br><br>
### 启动项目<br>
npm run dev
### 目录结构
![image](https://github.com/Jackeroo-jianan/vue-koa2/blob/1-%E5%89%8D%E5%90%8E%E7%AB%AF%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA/images/1622467771(1).png)
## 后端环境搭建

###  koa脚手架工具安装
npm install -g koa-generator 

### 创建项目文件
koa2 xxx
### 项目初始化
npm install
### 启动项目<br>
npm run dev
### 目录结构
![image](https://github.com/Jackeroo-jianan/vue-koa2/blob/1-%E5%89%8D%E5%90%8E%E7%AB%AF%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA/images/1622468689(1).png)
## 总结
本分支只讲了环境配置的相关内容，总体比较简单。另外在前后端中封装了一些工具的函数，安装配置一些细节的部分如果有问题可以自行百度，基本都是可以解决的
