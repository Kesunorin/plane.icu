<template>
  <el-config-provider namespace="ep">
    <header class="navbar">
      <div class="navbar-wrapper">
        <div class="header-container">
          <img src="./assets/menu.svg" class="menu" @click="openMenu" />
          <img src="./assets/logo.webp" class="logo" alt="Logo" />
          <span
            color="$ep-color-primary"
            px="2"
            style="
              display: flex;
              align-items: center;
              font-weight: bolder;
              font-size: larger;
            "
            >第一个mt之家</span
          >
        </div>
      </div>
    </header>

    <div class="overlay" v-if="sideOpen" @click="openMenu"></div>
    <div class="side" :class="sideOpen ? 'side-open' : ''">
      <el-menu default-active="/" class="side-menu" router="true">
        <el-menu-item index="/"> <span>首页</span> </el-menu-item>
        <el-menu-item index="/raidTier"> <span>总力战档线</span> </el-menu-item>
        <el-menu-item index="/eraidTier">
          <span>大决战档线</span>
        </el-menu-item>
        <el-menu-item index="/friendSearch">
          <span>好友查询</span>
        </el-menu-item>
        <el-menu-item index="/raidAnalysis"
          ><span>总力战统计</span></el-menu-item
        >
        <el-menu-item index="/about"> <span>关于</span> </el-menu-item>
      </el-menu>
    </div>

    <div class="main-right-container">
      <el-scrollbar class="scroll-content">
        <div class="right-box">
          <div class="content-box">
            <router-view />
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const sideOpen = ref(false);
function openMenu() {
  console.log("sideOpen", sideOpen.value);

  sideOpen.value = !sideOpen.value;
}
</script>

<style lang="scss">
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("~/assets/background.webp");
  background-size: cover;
  background-attachment: fixed;
  overflow: hidden;
  height: 100vh;
  margin: 0;

  --nav-height: 55px;
}

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #0009;
  transition: opacity 0.5s;
  z-index: 233;
}

.side {
  position: fixed;
  height: 100%;
  transition:
    background-color 0.2s,
    opacity 0.25s,
    transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translate(-100%);
  padding-top: var(--nav-height);

  @media screen and (min-width: 960px) {
    transform: translate(0);
  }

  &.side-open {
    background-color: #fff;
    transform: translate(0);
    z-index: 2333;
    // padding: 48px 0;
  }

  .side-menu {
    width: 220px;
    height: 100%;
  }
}

.navbar {
  width: 100vw;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
  top: 0;
  left: 0;

  .navbar-wrapper {
    position: relative;
    border-bottom: 1px solid #b1b1b1;
    padding: 0 12px 0 24px;
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    -webkit-backdrop-filter: saturate(50%) blur(4px);
    top: 0;
    display: flex;
    height: var(--nav-height);

    .header-container {
      display: flex;
      .menu {
        width: 25px;

        @media screen and (min-width: 960px) {
          display: none;
        }
      }

      .logo {
        padding: 10px;
      }
    }
  }
}

.main-right-container {
  flex: 1;
  overflow-y: auto;
  padding-top: var(--nav-height);

  @media screen and (min-width: 960px) {
    padding-left: 13rem;
  }

  .scroll-content {
    height: 93vh;

    .right-box {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;

      .content-box {
        width: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        padding: 10px;
        border-radius: 5px;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>
