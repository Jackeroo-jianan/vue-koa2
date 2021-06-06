<template>
  <div class="role__manager">
    <!-- 顶部查询栏 -->
    <div class="search__content">
      <!-- el-form指表单，:inline="true"行内显示， -->
      <el-form ref="form" :inline="true" :model="queryRole">
        <el-form-item prop="roleName" label="角色">
          <el-input v-model="queryRole.roleName" placeholder="请输入角色"></el-input>
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
      <!-- 信息表单 -->
      <el-table :data="roleList" row-key="_id" :tree-props="{children: 'children'}">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <!-- 增加操作列 -->
        <el-table-column label="操作" width=260>
          <!-- 通过#default="scope"获取当前行的属性 -->
          <template #default="scope">
            <el-button size="mini"  type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini"  type="primary" plain @click="handleSet(scope.row) ">设置权限</el-button>
            <el-button size="mini" type="danger" plain @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 右下分页部分 -->
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pageInfo.total"
        :page-size="pageInfo.pageSize"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 新增角色弹框 -->
   <el-dialog title='创建角色' v-model="showCreateForm" :before-close="beforeClose" center>
      <el-form ref='newRoleForm' :model="roleForm" label-width='100px' :rules='rules'>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="菜单名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input v-model="roleForm.remark" placeholder="备注说明" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode">
          <el-input v-model="roleForm.menuCode" placeholder="请输入权限" />
        </el-form-item>      
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog> 
    <!-- 权限设置弹框 -->
   <el-dialog title='权限设置' v-model="showPermissionForm" center>
      <el-form ref='setPermissionForm' >
        <el-form-item label="角色:">
          {{ theRoleName }}
        </el-form-item>
        <!-- 权限树 -->
        <el-form-item label="权限标识" >
          <el-tree
            ref="permissionTree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          >
          </el-tree>
        </el-form-item>      
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermissionForm=false">取 消</el-button>
          <el-button type="primary" @click="handlePtSubmit">确 定</el-button>
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
    const queryRole = reactive({});
    //--初始化表格分页信息--
    let roleList = ref([])
    //--展示创建菜单弹框是否显示的变量--
    const showCreateForm = ref(false)
    //--展示设置权限弹框是否显示的变量--
    const showPermissionForm = ref(false)
    //--初始化新建用户对象--
    const roleForm = reactive({})
   //--初始化表格分页信息--
    let pageInfo = reactive({pageSize:10,total:0});
    //--判断编辑/新增的属性--
    const action = ref([])
    //--设置权限时当前的角色名称--
    const theRoleName = ref('')
    //--设置权限时当前的角色id--
    const theRoleId = ref('')
    //--初始化菜单列表=>获取菜单权限--
    const menuList = ref([])
    //--初始化表格格式--
    const columns = reactive([
      { label: "角色名", prop: "roleName"},
      { label: "备注", prop: "remark"},
      { label: "权限标识", prop: "menuCode" },
      { label: "创建时间", prop: "createTime", formatter(row, column, value) {
            return utils.dateFormat("YYYY-mm-dd HH:MM",new Date(value))}}
    ]);
    //--定义表单校验规则--
    const rules = reactive({
        roleName:[{ required:true,message:'请输入角色',trigger:'blur' }],
    })
    
    //==页面自动加载用户列表==
    onMounted(() => { 
      getRoleList()   
      getMenuList()
      });

    //==获取用户信息列表(接口)==
    const getRoleList = async () => {
      try {
        let { list,page } = await proxy.$request.get("/roles/list", queryRole);
        roleList.value = list;  
        pageInfo = page;
      } catch (error) {
        console.error(error)
      }   
    };

    //==查询用户==
    const handleQuery = () => {
      getRoleList();
    };

    //==重置查询==
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };
    
    //==新建角色==
    const handleAdd =()=>{
      showCreateForm.value = true
      action.value = 'add'
    }

    //编辑当前角色
    const handleEdit = (row)=>{
      showCreateForm.value = true
      action.value = 'edit'
      proxy.$nextTick(()=>{
        Object.assign(roleForm,row)//浅拷贝
      })
    }

    //==删除角色==
    const handleDel =  async (id)=>{
      let params = {}
      action.value = 'delete'
      params.action = action.value
      params._id = id
      await proxy.$request.post('roles/operate',params) 
      proxy.$message.success('删除成功')
      getRoleList()
    }
  
    //==提交表单==
    const handleSubmit = () =>{
     proxy.$refs.newRoleForm.validate(async(valid)=>{
       if (valid){
         let params = toRaw(roleForm)
         params.action = action.value
         await proxy.$request.post('roles/operate',params) 
         proxy.$message.success('提交成功')
         handleReset('newRoleForm')
         getRoleList()
          }  
     })
   }

  //==关闭新增菜单弹框=>按钮关闭==
     const handleCancel = () => {
     handleReset('newRoleForm')
     showCreateForm.value = false
   }

  //==关闭新增菜单弹框=>右上叉号关闭==
      const beforeClose = ()=>{
      handleReset('newRoleForm')
      showCreateForm.value = false 
    }
  
  //==编辑当前角色的权限==
    const handleSet = (row) =>{ 
      showPermissionForm.value = true
      theRoleName.value = row.roleName
      theRoleId.value = row._id
      let {checkedKeys} = row.permissionList //当前具有的权限
      setTimeout(() => { //需要调整为异步
      //setCheckedKeys element自带函数，参数为要选中的节点数组，数组值在树结构里通过node-key属性已绑定
        proxy.$refs.permissionTree.setCheckedKeys(checkedKeys)  
      });
      
    }

  //==获取菜单列表=>获取权限==
  const getMenuList = async() =>{
    try {
      const res = await proxy.$request.get('menu/list','',{mock:false}) 
      menuList.value = res
    } catch (error) {
      console.error(error)
    }
  } 

  //==提交权限设置后的结果==
  const handlePtSubmit = async ()=>{
    let nodes = proxy.$refs.permissionTree.getCheckedNodes() //选中的菜单，存放的时node对象
    let halfKeys = proxy.$refs.permissionTree.getHalfCheckedKeys() //用来存放半选中的菜单，把node-key存入数组
    let checkedKeys =[] //用来存放选中的按钮
    let parentKeys = []  //用来存放选中的菜单
    nodes.map((node)=>{
      if(!node.children){
        checkedKeys.push(node._id)
      }else{
        parentKeys.push(node._id)
      }
    })
    let params={
      id:theRoleId.value,
      permissionList:{
        checkedKeys, //选中的按钮(数组)
        halfCheckedKeys:parentKeys.concat(halfKeys)//选中+半选中的菜单(数组)
      }
    }
     await proxy.$request.post('/roles/update/permission',params) 
     showPermissionForm.value = false
     proxy.$message.success('设置成功')
     getRoleList()
  }


    //==当前页变动时候触发的事件==
    const handleCurrentChange = (currentPageNum) => {
      pageInfo.pageNum = currentPageNum;
      getRoleList();
    };

    return {
      queryRole,
      columns,  
      roleList,  
      rules,
      roleForm,
      action,
      pageInfo,
      showCreateForm,
      showPermissionForm,
      theRoleName,
      menuList,
      getRoleList, 
      handleSubmit,
      handleCancel,
      beforeClose,
      handleAdd,
      handleEdit,
      handleDel,
      handleSet,
      handleQuery,
      handleReset,
      getMenuList,
      handlePtSubmit,
      handleCurrentChange

    };
  },
};
</script>

<style lang="scss" >
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
  .pagination {
    text-align: right;
    padding: 10px;
  }
}
</style>