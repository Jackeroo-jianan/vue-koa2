<template>
  <div class="basic">
    <div class="nav"></div>
    <div class="content">
      <div class="content__top">
        <div class="font">首页</div>
        <div class="behind">admin</div>
      </div>
      <div class="wrapper">
        <div class="wrapper__page">
          <router-view> </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
export default {
  name: "Home",
};
</script>

<style lang="scss" scoped>
.basic {
  position: relative;
  .nav {
    position: fixed;
    width: 2rem;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
  }
  .content {
    margin-left: 2rem;
    .content__top {
      height: 0.5rem;
      line-height: 0.5rem;
      display: flex;
      justify-content: space-between;
      border-bottom: 0.01rem solid gray;
      padding: 0 0.2rem;
    }
    .wrapper {
      background-color: #eef0f3;
      padding: 0.2rem;
      height: calc(100vh - 0.5rem);
      .wrapper__page{
        background-color: #fff;
        height: 100%;
      }
    }
  }
}
</style>
