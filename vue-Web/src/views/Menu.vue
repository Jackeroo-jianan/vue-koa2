<template>
  <div class="menu__manager">
    <!-- 顶部查询栏 -->
    <div class="search__content">
      <!-- el-form指表单，:inline="true"行内显示， -->
      <el-form ref="form" :inline="true" :model="queryMenu">
        <el-form-item prop="menuName" label="菜单名">
          <el-input v-model="queryMenu.menuName" placeholder="请输入菜单名"></el-input>
        </el-form-item>
        <el-form-item prop="menuState" label="菜单状态">
          <el-select v-model="queryMenu.menuState">  
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="禁用"></el-option>    
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery" type="primary">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 下方主表单 -->
    <div class="base__table">
      <!-- 公共功能 -->
      <div class="actions">
        <el-button type="primary" @click="handleAdd('')">新增</el-button>
      </div>
      <!-- 菜单信息表单 -->
      <el-table :data="menuList" row-key="_id" :tree-props="{children: 'children'}" stripe>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <!-- 增加操作列 -->
        <el-table-column label="操作">
          <!-- 通过#default="scope"获取当前行的属性 -->
          <template #default="scope">
            <!-- <el-button size="mini" type="text" @click="handleAdd(scope.row)">新增</el-button> -->
            <el-button size="mini"  type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" plain @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增用户弹框 -->
   <el-dialog :title ="action == 'add'?'新建菜单':'编辑菜单'" v-model="showCreateForm" :before-close="beforeClose" center>
      <el-form ref='newMenuForm' :model="menuForm" label-width='100px' :rules='rules'>
        <el-form-item label="父级菜单" prop="deptId">
          <el-cascader
            v-model="menuForm.parentId"
            placeholder="请选择所属部门"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode">
          <el-radio-group v-model="menuForm.menuType">
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="菜单名称" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.path" placeholder="请输入路由" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType === 1">
          <el-radio-group v-model="menuForm.menuState">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog> 
  </div>
</template>

<script>
import { onMounted, ref, reactive, getCurrentInstance,toRaw } from "vue";
import utils from '../utils/utils'

export default {
  name: "user",
  setup() {
    //--获取当前实例对象--
    const { proxy } = getCurrentInstance(); 
    //--初始化列表查询表单对象--
    const queryMenu = reactive({menuState: 1});
    //--初始化表格信息--
    const menuList = ref([])
    //--初始化新增表单对象
    const menuForm = reactive({parentId:[null],menuState:1,menuType:1})
    //--展示创建菜单弹框是否显示的变量--
    const showCreateForm = ref(false)
    //--判断编辑/新增的属性--
    const action = ref([])
    //--初始化表格格式--
    const columns = reactive([
      { label: "菜单名", prop: "menuName"},
      //{ label: "图标", prop: "icon"},
      { label: "菜单类型", prop: "menuType",formatter(row, column, value) {
        return { 1: "菜单", 2: "按钮",}[value]}},
     { label: "菜单状态", prop: "menuState", width: 90,formatter(row, column, value) {
        return { 1: "正常", 2: "停用"}[value]}},
      { label: "权限标识", prop: "menuCode" },
      { label: "路由地址", prop: "path" },
     // { label: "组件路径", prop: "component" }, 
      { label: "创建时间", prop: "createTime", formatter(row, column, value) {
            return utils.dateFormat("YYYY-mm-dd HH:MM",new Date(value))}}
    ]);
    //--定义表单校验规则--
    const rules = reactive({
        menuName:[{ required:true,message:'请输入名称',trigger:'blur' }],
    })
    
    
    //==页面自动加载用户列表==
    onMounted(() => { 
      getMenuList()   
      });

    //==获取用户信息列表(接口)==
    const getMenuList = async () => {
      try {
        let list = await proxy.$request.get("/menu/list", queryMenu,{mock:false});
        menuList.value = list;  
      } catch (error) {
        console.log(error)
      }   
    };

    //==查询用户==
    const handleQuery = () => {
      getMenuList();
    };

    //==重置查询==
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };

   //==创建菜单==
   const handleAdd = () => {
     showCreateForm.value = true
     action.value = 'add'
   }

  //==编辑菜单==
  const handleEdit = (row)=> {
     showCreateForm.value = true
     action.value = 'edit'
     proxy.$nextTick(()=>{
        Object.assign(menuForm,row)//浅拷贝
      })
   }

   //==删除菜单==
   const handleDel = async(_id) => {
     action.value = 'delete'
     let params = {}
     params.action = action.value
     params._id = _id
     let res = await proxy.$request.post('menu/operate',params,{mock:false})
     if (res){
            proxy.$message.success('删除成功')
            getMenuList()
          }else{
            proxy.$message.error('删除失败');
         }
   }

  //==关闭新增菜单弹框=>按钮关闭==
  const handleCancel = () => {
     handleReset('newMenuForm')
     showCreateForm.value = false
   }

  //==关闭新增菜单弹框=>右上叉号关闭==
  const beforeClose = ()=>{
      handleReset('newMenuForm')
      showCreateForm.value = false 
    }

  //==提交表单==
   const handleSubmit = () =>{
     proxy.$refs.newMenuForm.validate(async(valid)=>{
       if (valid){
         let params = toRaw(menuForm)
         params.action = action.value
         console.log(params)
         await proxy.$request.post('menu/operate',params,{mock:false}) 
         proxy.$message.success('提交成功')
         handleReset('newMenuForm')
         getMenuList()
          }  
     })
   }

    return {
      queryMenu,
      columns,  
      menuList,  
      menuForm,
      rules,
      showCreateForm,
      action,
      getMenuList,  
      handleAdd,
      handleEdit,
      handleDel,
      handleCancel,
      beforeClose,
      handleQuery,
      handleReset,
      handleSubmit

    };
  },
};
</script>

<style lang="scss" scoped>
.search__content {
  background-color: #ffffff;
  padding: 22px 20px 0;
  border-radius: 5px;
}
.base__table {
  border-radius: 5px;
  background: #fff;
  margin-top: 20px;
  margin-bottom: 20px;
  overflow-y: auto;
  .actions {
    border-radius: 5px 5px 0px 0px;
    background: #ffffff;
    padding: 10px;
    border-bottom: 1px solid #ece8e8;
  }
}
</style>