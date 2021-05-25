<template>
    <template v-for="menu in menuList" >
      <!-- el-submenu是父菜单，只有当它存在子菜单时进行显示 -->
        <el-submenu v-if="menu.children && menu.children.length>0 &&  menu.children[0].menuType == 1" :key="menu._id" :index="menu.path">
          <!-- 在template中打印出icon和菜单名称 -->
          <template #title>
            <i :class="menu.icon"></i>
            <span >{{menu.menuName}}</span>
          </template>
          <!-- 遍历当前父菜单下的子菜单，它们仍有可能是新的父菜单 -->
           <tree-menu :menuList="menu.children"/>
        </el-submenu>
        <!-- 循环渲染子菜单 -->
        <el-menu-item v-else-if="menu.menuType == 1 && !isCollapse"  :index="menu.path" :key="menu._id">{{menu.menuName}}</el-menu-item> 
    </template>
 
</template>
<script>
export default {
  name: "TreeMenu",
  props: {
    //接收父组件属性menyList，默认Array类型
    menuList: {
      type: Array,
      default() {
        return [];
      },
    },
    isCollapse: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
};
</script>
<style lang='scss'>
.span{
  text-align: center;
  
}

</style>
