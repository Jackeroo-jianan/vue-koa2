<template>
  <div class="user__manager">
    <!-- 顶部查询栏 -->
    <div class="search__content">
      <!-- el-form指表单，:inline="true"行内显示， -->
      <el-form ref="form" :inline="true" :model="user">
        <el-form-item prop="userId" label="用户ID">
          <el-input v-model="user.userId" placeholder="请输入id"></el-input>
        </el-form-item>
        <el-form-item prop="userName" label="用户名">
          <el-input
            v-model="user.userName"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="state" label="状态">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在岗"></el-option>
            <el-option :value="2" label="实习"></el-option>
            <el-option :value="3" label="离职"></el-option>
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
        <el-button type="primary" @click="handleCreate" v-has:add="'user-manage'">新增</el-button>
        <el-button type="danger" @click="handleBatchDel" v-has:add="'user-manage'">批量删除</el-button>
      </div>
      <!-- 用户信息表单 -->
      <el-table :data="userList" @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <!-- 增加操作列 -->
        <el-table-column label="操作" >
          <!-- 通过#default="scope"获取当前行的属性 -->
          <template #default="scope">
            <el-button size="mini" type="primary" plain
             @click="handleEdit(scope.row)"
             v-has:add="'user-manage'"
              >编辑</el-button>
            <el-button size="mini" type="danger" plain
              @click="handleSingleDel(scope.row)"
              v-has:add="'user-manage'"
              >删除</el-button
            >
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
    <!-- 新增用户弹框 -->
    <el-dialog :title ="action == 'add'?'新建用户':'编辑用户'" v-model="showCreateForm" :before-close="beforeClose" center>
      <el-form ref='newForm' :model="userForm" label-width='100px' :rules='rules'>
        <el-form-item label="用户名" prop="userName" >
          <el-input v-model="userForm.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option label="在岗" :value="1"></el-option>
            <el-option label="实习" :value="2"></el-option>
            <el-option label="离职" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
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
    //--初始化用户表单对象--
    const user = reactive({state: 0,});
    //--初始化用户表单数据--
    const userList = ref([]);
    //--初始化表格分页信息--
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
    });
    //--初始化选中的用户对象--
    const checkedUsersId = ref([]);
    //--展示创建用户弹框是否显示的变量--
    const showCreateForm = ref(false)
    //--初始化新建用户对象--
    const userForm = reactive({})
    //--初始化角色列表--
    const roleList = ref([])
    //--初始化部门列表--
    const deptList = ref([])
    //定义操作列表属性
    const action = ref('add')
    //--初始化表格格式--
    const columns = reactive([
      { label: "用户ID", prop: "userId",width:70},
      { label: "用户名", prop: "userName",width:80},
      { label: "邮箱", prop: "userEmail",},
      { label: "权限", prop: "role",width:80, 
        formatter(row, column, value) {
          return { 0: "管理员", 1: "会员" }[value];},},
      { label: "状态", prop: "state" ,width:100,
        formatter(row, column, value) {
          return { 1: "在岗", 2: "实习", 3: "离职" }[value];},},
      { label: "注册时间", prop: "createTime", 
        formatter(row, column, value) {
          return utils.dateFormat("YYYY-mm-dd HH:MM",new Date(value))}},
      { label: "最后登录时间", prop: "lastLoginTime", width:150,
       formatter(row, column, value) {
          return utils.dateFormat("YYYY-mm-dd HH:MM",new Date(value))}},

    ]);
    //--定义表单校验规则--
    const rules = reactive({
        userName:[{ required:true,message:'请输入用户名称',trigger:'blur' }],
        userEmail:[{ required:true,message:'请输入用户邮箱',trigger:'blur' }],
        mobile:[{ required:true,message:'请输入用户手机号',trigger:'blur' }],
        deptId:[{ required:true,message:'请选择所在部门',trigger:'blur' }]
    })
    
    //==页面自动加载用户列表==
    onMounted(() => { 
      getUserList()   
      });

    //==获取用户信息列表(接口)==
    const getUserList = async () => {
      let params = { ...user, ...pageInfo }; //用户和页码的全部参数信息

      try {
        const { list, page } = await proxy.$request.get("/users/list", params,{mock:false});
        userList.value = list;
        pageInfo.total = page.total;
      } catch (err) {
        console.log(err);
      }
    };

    //==查询用户==
    const handleQuery = () => {
      getUserList();
    };

    //==重置查询==
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };

    //==当前页变动时候触发的事件==
    const handleCurrentChange = (currentPageNum) => {
      pageInfo.pageNum = currentPageNum;
      getUserList();
    };

    //==删除单个用户(接口)==
    const handleSingleDel = async (row) => {
      await proxy.$request.post("/users/delete", { userIds: [row.userId] },{mock:false});
      proxy.$message.success("删除成功"); //element的消息成功提示
      getUserList(); //重新刷新用户信息列表
    };

    //==批量删除用户(接口)==
    const handleBatchDel = async () => {
      if (checkedUsersId.value.length === 0) {
        proxy.$message.warning("请选择要删除的对象");
        return;
      }
      await proxy.$request.post("/users/delete", {
        userIds: checkedUsersId.value
      },{mock:false});
      proxy.$message.success("删除成功"); //element的消息成功提示
      getUserList(); //重新刷新用户信息列表
    };

    //==获取所有选中用户的ID==
    const handleSelectionChange = (list) => {
      let arr = [];
      list.map((item) => {
        arr.push(item.userId);
      });
      checkedUsersId.value = arr;
    };

    //==获取部门列表(接口)==
    const getDeptList = async() =>{
      let list = await proxy.$request.get('/dept/list')
       deptList.value = list
    }

    //==获取权限列表(接口)==
    const getRoleList = async() =>{
      let list = await proxy.$request.get('/roles/allList','',{mock:false})
      roleList.value = list
    }

    //==打开新增用户弹窗==
    const handleCreate = ()=>{
      action.value='add'
      getDeptList()
      getRoleList()
      //action.value='add'
      showCreateForm.value = true 
    }

    //==编辑当前用户==
    const handleEdit =  (row)=>{
      action.value = 'edit'
      getDeptList()
      getRoleList()
      //action.value = 'edit'
      showCreateForm.value = true
      proxy.$nextTick(()=>{
        Object.assign(userForm,row)//浅拷贝
      })
    }

    //==关闭新增用户弹窗=>按钮关闭==
    const handleCancel = ()=>{
      handleReset('newForm')
      showCreateForm.value = false 
    }

    //==关闭新增用户弹窗=>右上关闭==
    const beforeClose = ()=>{
      handleReset('newForm')
      showCreateForm.value = false 
    }

    //==提交新增/编辑用户信息==
    const handleSubmit = ()=>{
      proxy.$refs.newForm.validate(async(valid)=>{
        if(valid){
          let params = toRaw(userForm);
          params.action = action.value;
          let res = await proxy.$request.post('users/operate',params,{mock:false})
          if (res){
            proxy.$message.success('提交成功')
            handleReset('newForm')
            getUserList()
          }else{
            proxy.$message.error('提交失败');
         }
        }
      })
    }


    return {
      user,
      userList,
      columns,
      rules,
      pageInfo,
      checkedUsersId,
      userForm,
      getUserList,
      roleList,
      deptList,
      action,
      showCreateForm,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleSingleDel,
      handleBatchDel,
      handleSelectionChange,
      handleCreate,
      getDeptList,
      getRoleList,
      handleEdit,
      handleCancel,
      beforeClose,
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
  .pagination {
    text-align: right;
    padding: 10px;
  }
}
</style>