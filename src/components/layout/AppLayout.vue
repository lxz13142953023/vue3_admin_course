<script setup lang="ts">
import { RouterView } from 'vue-router'
// 引入组件
import AppAside from './AppAside.vue'
import AppHeader from './AppHeader.vue'
import { ref } from 'vue'
// 定义侧边栏的模板引用
let Aside = ref(null)
let state = ref(false)

// 待被触发的事件，获取头部布尔值的变化
const TransmitState = () => {
  Aside.value.ChangeState()
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧边栏 -->
      <AppAside ref="Aside" :state="state"></AppAside>
      <el-container class="header-and-main">
        <!-- 头部 -->
        <AppHeader @TransmitState="TransmitState"></AppHeader>
        <!-- 主体 -->
        <el-main>
          <el-scrollbar>
            <RouterView />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.header-and-main {
  flex-direction: column;
  height: 100vh;
}
.el-main {
  background-color: #fef0f0;
  // padding-right: 0;
}
</style>
