<template>
<div class="wrapper__welcome">
  <div class="welcome">
    <h1 class="welcome__prompt">欢迎体验</h1>
    <div class="welcome__title">基于vue+koa2的后台管理系统</div>
    <div class="welcome__desc">—author: jackeroo &nbsp;&nbsp;&nbsp;&nbsp;Date: {{dateFormat(date)}}</div>
  </div>
  <div class="img" ></div>

</div>
  
  
</template>

<script>
export default {
  name:'Welcome',
  data(){
      return{
        date:new Date()
      }
    },
    methods:{
      dateFormat(time) {
          var date=new Date(time);
          var year=date.getFullYear();
          
          // 在日期格式中，月份是从0开始的，要加1 
          var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
          var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
          var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
          var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
          var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
          return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
      }
    },
    mounted() {
          //显示当前日期时间
          let currentTime = this// 声明一个变量指向Vue实例this，保证作用域一致
          this.timer = setInterval(() => {
           currentTime.date = new Date(); // 修改数据date
           }, 1000)
       },
    beforeUnmount() {
       if (this.timer) {
        clearInterval(this.timer); // 在Vue实例销毁前，清除定时器
      }
}
}
</script>

<style lang='scss' scoped>
 .wrapper__welcome{
   position:relative;
   
   .welcome{
     position:absolute;
     top:30vh;
     left:10vw;
     margin: 0.1rem;
     .welcome__prompt{
       font-size: 0.18rem;
       
     }
     .welcome__title{
       font-size: 0.25rem;
       color: rgb(0, 17, 255);
       
     }
     .welcome__desc{
       font-size: 0.14rem;
       color:gray
     }
   }
    .img{
       background-image: url('./../assets/logo.png');
       width: 200px;
       height: 200px;
       position:absolute;
       top:20vh;
       left: 40vw;
    }
 }

</style>
