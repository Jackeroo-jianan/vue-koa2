<template>
  <router-view></router-view>
</template>

<script >
//export命令定义了模块的对外接口 
export default {
  name:'App',
  mounted(){
    this.$storage.setItem('age2',{name:'hj',age:50})
    console.log(this.$storage.getItem('name'))
    this.$storage.clearItem('name')
    this.$storage.clearAll()
  }
}

</script>
  
<style lang='scss'>

</style>
