<template>
<div class="wrapper">
    <div class="model">
      <!-- ref来表单校验(触发登录时)，status-icon输入时出现 :rules表单验证(不触发事件) -->
      <el-form ref='check' :model='users' status-icon :rules="rules">
        <div class="title">Admin</div>
        <!-- 表单验证需要传入prop -->
        <el-form-item prop='userName'>
          <el-input type='text' prefix-icon="el-icon-user" v-model='users.userName' placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop='userPwd'>
          <el-input type='password' prefix-icon="el-icon-view" v-model='users.userPwd' placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item class='login'>
          <el-button type='primary' class='login_btn' @click='handleLogin'>登录</el-button>
        </el-form-item>
      </el-form>
    </div>
</div>

</template>

<script >
//import Welcome from './Welcome.vue'
export default {
  name:'login',
  data(){
    return{
      users:{
        userName:'',
        userPwd:''
      },

      //表单校验规则(非触发事件响应)
      rules:{
        userName:[
          //required是否必填，message默认显示内容，trigger触发条件:blur=>失去焦点，change=>数据改变
          {required:true,message:'请输入用户名',trigger:'blur'}
          ],
        userPwd:[
          {required:true,message:'请输入密码',trigger:'blur'}
        ]
      }
    }
  },
 
  methods:{
    handleLogin(){
      this.$refs.check.validate((vaild)=>{//validate:对整个表单进行校验的方法
        //表单校验通过，发送post请求获取数据，访问正常跳转页面，并进入store
        if(vaild){
          
          this.$request.post('/users/login',this.users).then((res)=>{
            this.$store.commit('saveUserInfo',res)
            this.$router.push('/welcome')  
          })
        }
        else{return false}
      })
    },
    goHome(){
      this.$router.push('/welcome')
    }
  }
}

</script>

<style lang="scss" scoped>
.wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width:100vw;
  height: 100vh;
}
.model{
  width: 4rem;
  //height: 3rem;
  padding: 0.3rem;
  background-color: #fff;
  border-radius: 0.1rem;
  box-shadow: 0px 0px 3px 1px #f3f3f3 ;
}
.title{
  font-size: 0.25rem;
  text-align: center;
  margin-bottom: 0.2rem;
}
.login{
  text-align: center;
  margin: auto;
}
</style>

