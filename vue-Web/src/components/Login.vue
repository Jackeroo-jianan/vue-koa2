<template>
<div>
  <h1>欢迎来到登录界面</h1>

  <el-button @click='goHome'>回首页</el-button>
</div>
  

</template>

<script >
//import Welcome from './Welcome.vue'
export default {
  name:'Login',
  //components:{Welcome},
  mounted(){
    this.$request({
      method: 'get',
      url: '/login',
      data: {
      firstName: 'Fred',
      lastName: 'Flintstone'
  }
    }).then((res)=>{
      console.log('res:',res)
    })
  },
  methods:{
    goHome(){
      this.$router.push('/welcome')
    }
  }
}

</script>

<style scoped>
a {
  color: #42b983;
}
</style>
