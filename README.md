# vue-koa2
## RBAC模型
  RBAC  是基于角色的访问控制（Role-Based Access Control ）在 RBAC 中，权限与角色相关联，用户通过成为适当角色的成员而得到这些角色的权限。这样管理都是层级相互依赖的，权限赋予给角色，而把角色又赋予用户
![image](https://github.com/Jackeroo-jianan/vue-koa2/blob/master/imgs/aF62T8Yu9fZ7APgdK2Zf.png)
## 效果展示
### 用户
编辑/新建用户信息，角色是必选项，一个用户可以拥有多个角色
![image](https://github.com/Jackeroo-jianan/vue-koa2/blob/master/imgs/user.png)
### 菜单 
菜单可以在前端页面创建入库，并动态渲染到界面，前提是用户拥有创建的权限
![image](https://github.com/Jackeroo-jianan/vue-koa2/blob/master/imgs/menu.png)
### 角色
不同的角色对应不同的权限，如查阅权限，修改权限等，用户根据自身的角色获取权限
![image](https://github.com/Jackeroo-jianan/vue-koa2/blob/master/imgs/role.png)
### 部门
用户的基本信息之一，完成审批流的必要部分
![image](https://github.com/Jackeroo-jianan/vue-koa2/blob/master/imgs/dept.png)
