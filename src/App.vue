<template>
  <el-config-provider namespace="ep">
    <BaseHeader class="header" />
    <div class="main-container">
      <BaseSide class="side" />
      <div class="main-right-container">
        <el-scrollbar class="scroll-content" max-height="100vw">
          <div class="right-box">
            <div class="content-box">
              <router-view />
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </el-config-provider>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("assets/background.webp");
  background-size: cover;
  background-attachment: fixed;
  overflow: hidden;
  /* Hide scrollbars on the entire page */
  height: 100vh;
  /* Ensure the body takes full height */
  margin: 0;
  /* Remove default margin */
}

.main-container {
  display: flex;
  height: calc(100vh - 60px);
}

.main-right-container {
  flex: 1;
  overflow-y: auto;
  /* Enable vertical scroll */
}

.right-box {
  display: flex;
  justify-content: center;
  /* 居中对齐子元素（水平） */
  align-items: center;
  /* 居中对齐子元素（垂直） */
  flex: 1;
}

.content-box {
  width: calc(100vw - 300px);
  background-color: rgba(255, 255, 255, 0.5);
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  padding: 10px;
  border-radius: 5px;
  flex-direction: column;
  align-items: center;
}
</style>
