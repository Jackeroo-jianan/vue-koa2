<template>
  <div class="basic">
    <!-- 左侧导航 -->
    <div :class="{ nav: !isCollapse, collNav: isCollapse }">
      <!-- <div :class= nav> -->
      <div class="nav__desc">
        <img class="nav__desc__img" src="./../assets/佐助.jpg" />
        <span class="nav__desc__title" v-if="!isCollapse">我的管理</span>
        
      </div>
      <!-- 左侧菜单栏组件 -->
    <el-menu
    class="el-menu-vertical-demo"
    background-color="#001529"
    text-color="#fff"
   :collapse="isCollapse"
  >
     <tree-menu  :menuList='menuList'/>
   </el-menu>    
   
    </div>

    <!-- 右侧展示 -->
    <div class="content">
      <!-- 右侧顶部 -->
      <div class="content__top">
        <div class="rip">
          <div class="el-icon-s-fold" @click="handleClickRetract()"></div>
          <div class='breadCrumb'> <BreadCrumb/></div>
           
          
        </div>
        <div class="behind">
          <el-badge :is-dot="noticeCount > 0" class="item" type="danger">
            <span class="el-icon-message-solid"></span>
          </el-badge>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link userInfo">
              {{ userInfo?.userName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- 右侧主页内容 -->
      <div class="wrapper__main">
        <div class="wrapper__main__page">
          <router-view> </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
import TreeMenu from "../components/TreeMenu.vue";
import BreadCrumb from "../components/BreadCrumb.vue";

export default {
  name: "Home",
  components: { TreeMenu, BreadCrumb },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo,
      noticeCount: 0,
      menuList:[]
    };
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
  },
  methods: {
    handleCommand(value) {//退出登录
      if (value === "logout") this.$store.commit("saveUserInfo", "");
      this.userInfo = null;
      this.$router.push("/login");
    },
    handleClickRetract() {//收起/展开菜单栏
      this.isCollapse = !this.isCollapse;
    },
    async getNoticeCount() {//获取未读消息
      try {
        const count = await this.$request.get("/leave/count");
        //console.log(count)
        this.noticeCount = count;
      } catch (err) {
        console.log(err);
      }
    },
    async getMenuList() {//获取菜单列表
      try {
        const result = await this.$request.get("/menu/list");
        
        this.menuList = result;
        console.log(this.menuList)
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" >

.basic {
  display: flex;
  .collNav {
 
    width: 0.51rem;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: all 0.5s;
    //box-sizing: border-box;
    overflow-x: hidden;
  }
  .nav {
    width: 2rem;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: all 0.2s;
    overflow-x: hidden;
  }
  .nav__desc {
    display: flex;
    height: 0.4rem;
    align-items: center;
    padding-left: 0.2rem;
    padding-top:0.1rem;
    font-size: 0.16rem;
    .nav__desc__img {
      height: 0.25rem;
      width: 0.25rem;
      margin-right: 0.1rem;
      border-radius: 50%;
    }
  }
  .el-menu-vertical-demo {
    border-right: none;
  }

  .content {
    height: 100vh;
    width: 100%;
    position: relative;
    border-left: none;
   
    .content__top {
      height: 0.5rem;
      line-height: 0.5rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      border-bottom: 0.01rem solid gray;
      padding: 0 0.2rem;
      font-size: 0.16rem;
      .rip {
        display: flex;
        text-align: center;
        height: 0.5rem;

         .el-icon-s-fold {
           margin: auto;
           margin-right: 0.1rem;
         }
        .breadCrumb{
           line-height: 0.5rem;
          margin: auto;
         }
       }
      .behind {
        .item {
          line-height: 0.15rem;
        }
        .userInfo {
          margin-left: 0.15rem;
        }
      }
    }
    .wrapper__main {
      position: absolute;
      top: 0.5rem;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #f5f5f5;
      padding: 0.2rem;
      //height: calc(100vh - 0.5rem);
      .wrapper__main__page {
        background-color: #fff;
        height: 100%;
      }
    }
  }
}
</style>
