<template>
    <div class="dept__manager">
        <!-- 顶部查询部分 -->
        <div class="search__content">
             <el-form ref="queryForm" :inline="true" :model="queryDept">
        <el-form-item label="部门名称">
          <el-input
            placeholder="请输入部门名称"
            v-model="queryDept.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDeptList" type="primary">查询</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
        </div>
        <!-- 下方主表单 -->
        <div class="base__table">
            <!-- 公共功能 -->
            <div class="actions">
                <el-button  type="primary" @click ='handleAdd'>新增</el-button>
            </div>
            <!-- 信息表单 -->
            <el-table :data='deptList' row-key='_id' :tree-props="{children:'children'}" stripe>
                <el-table-column
                v-for="item in columns"
                :key="item.prop"
                v-bind="item"
                ></el-table-column>
                <!-- 自定义最后一列    -->
                <el-table-column label='操作'>
                    <template #default='scope'>
                        <!-- 通过#default="scope"获取当前行的属性 -->
                        <el-button size="mini"  type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini"  type="danger" plain @click="handleDel(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>      
            </el-table>
        </div>
        <!-- 新建/编辑表单 -->
        <el-dialog :title ="action == 'add'?'新建部门':'编辑部门'" v-model="showCreateForm" center >
            <el-form ref='newDeptForm' :model="deptForm" label-width='100px' :rules='rules'>
                <el-form-item label = '上级部门' prop='parentId'>
                    <el-cascader
                    placeholder = '请选择上级部门'
                    v-model = deptForm.parentId
                    :options = deptList
                    :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
                    clearable
                    />
                </el-form-item>
                <el-form-item label='部门名称' prop='deptName'>
                    <el-input placeholder = '请输入部门名称' v-model ="deptForm.deptName" />  
                </el-form-item>
                <el-form-item label='负责人' prop='user'>
                    <el-select placeholder = '请选择部门负责人' v-model ="deptForm.user" @change ='displayEmail'>
                        <el-option
                        v-for="item in userList"
                        :key="item.userId"
                        :label="item.userName"
                        :value="`${item.userId}/${item.userName}/${item.userEmail}`"
                        ></el-option>
                    </el-select>  
                </el-form-item>
                <el-form-item label='负责人邮箱' prop='userEmail'>
                    <el-input placeholder = '负责人邮箱' v-model ="deptForm.userEmail" disabled/>  
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
import utils from '../utils/utils'
export default {
    name:'dept',
    data(){
        return {
            //--初始化查询表单--
            queryDept:{},
            //--初始化部门列表--
            deptList:[],
            //--初始化分页信息--
            pageInfo:{pageNum:1,pageSize:10},
            //--判断编辑/新增的属性--
            action:'',
            //--初始化新增表单展示状态--
            showCreateForm:false,
            //--初始化新增表单--
            deptForm:{parentId: [null]},
            //--初始化用户列表--
            userList:[],
            //--初始化列名--
            columns:[
                {label:'部门名称',prop:'deptName'},
                {label:'负责人',prop:'userName'},
                {label:'更新时间',prop:'updateTime',formatter(row, column, value) {
                    return utils.dateFormat("YYYY-mm-dd HH:MM",new Date(value))}}
                ],
            //--表单验证规则--
            rules :({
            parentId:[{ required:true,message:'请选择上级部门',trigger:'blur' }],
            deptName:[{ required:true,message:'请输入部门名称',trigger:'blur' }],
            user:[{ required:true,message:'请选择部门负责人',trigger:'blur' }],
                })
        }
    },
    mounted(){
        this.getDeptList()
        this.getUserList()
    },
    methods:{
        //==获取部门列表==
        async getDeptList(){
            let params = {...this.queryDept}
            try {
                let list = await this.$request.get('/dept/list',params,{mock:false})
            this.deptList = list
            
            } catch (error) {
                throw new Error(error);
            }
        },
        //==获取用户列表,选择部门负责人==
        async getUserList(){
            try {
                this.userList = await this.$request.get('/users/all/list','',{mock:false})
            } catch (error) {
                throw new Error(error);
            }
        },
        //==编辑部门==
        handleEdit(row) {
      this.action = "edit";
      this.showCreateForm = true;
      this.$nextTick(() => {
        Object.assign(this.deptForm, row, {
          user: `${row.userId}/${row.userName}/${row.userEmail}`,
        });
      });
    },
        //==删除部门==
        async handleDel(_id){
            this.action = 'delete'
            await this.$request.post('/dept/operate',{_id,action:this.action},{mock:false})
            this.$message.success("删除成功");
            this.getDeptList()
        },
        //==自动显示负责人邮箱==
        displayEmail(val){
            const[userId,userName,userEmail]= val.split('/')
            //浅拷贝，效果类似于拼接
            Object.assign(this.deptForm,{userId,userName,userEmail})
        },
        //==重置查询==
        handleReset(form){
            this.$refs[form].resetFields()
        },
        //==打开新增部门表单的函数==
        handleAdd(){
            this.action = 'add'
            this.showCreateForm = true
        },
        //==关闭框==
        handleCancel(){
            this.showCreateForm = false
            this.handleReset('newDeptForm')
        },
        //==提交表单==
        handleSubmit(){
            this.$refs.newDeptForm.validate(async(valid)=>{
                if(valid){
                    let params = {...this.deptForm,action:this.action}
                    delete params.user
                    await this.$request.post('/dept/operate',params,{mock:false})
                    this.$message.success('提交成功')
                    this.handleCancel()
                    this.getDeptList()    
                }
            })
        }
    }
}
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