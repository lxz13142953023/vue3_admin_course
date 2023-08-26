<script setup lang="ts">
import { ref } from 'vue'
// 接受头部传递给父组件之后又传递过来的展开合并的开关值
let state = ref(false)

const ChangeState = () => {
  state.value = !state.value
}

defineExpose({ ChangeState })
</script>
<template>
  <div>
    <el-aside>
      <el-menu
        router
        unique-opened
        :collapse="state"
        background-color="#f89898"
        active-text-color="#fcd3d3"
      >
        <a href="/" class="logo">
          <img src="@/assets/logo.svg" alt="课程管理" />
          <h1>课程管理系统</h1>
        </a>
        <el-sub-menu index="1">
          <!-- 父菜单 -->
          <template #title>
            <el-icon>
              <Setting />
            </el-icon>
            <span>权限管理</span>
          </template>
          <!-- 子菜单 -->
          <el-menu-item index="/menus">
            <el-icon><Setting /></el-icon> <span>菜单列表</span>
          </el-menu-item>
          <el-menu-item index="/resources">
            <el-icon><Setting /></el-icon> <span>资源列表</span>
          </el-menu-item>
          <el-menu-item index="/roles">
            <el-icon><Setting /></el-icon> <span>角色列表</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/users">
          <el-icon><Setting /></el-icon> <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/courses">
          <el-icon><Setting /></el-icon> <span>课程管理</span>
        </el-menu-item>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><Setting /></el-icon> <span>广告管理</span>
          </template>
          <el-menu-item index="advertisement">
            <el-icon><Setting /></el-icon> <span>广告列表</span>
          </el-menu-item>
          <el-menu-item index="advertingSpace">
            <el-icon><Setting /></el-icon> <span>广告位管理</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
  </div>
</template>

<style scoped lang="scss">
::-webkit-scrollbar {
  display: none;
}
.el-aside {
  background-color: #f89898;
  height: 100vh;
  width: auto;
}
.el-menu {
  width: 200px;
  // background-color: #fab6b6;
  border-right: none;
  &.el-menu--collapse {
    width: 60px;
    & h1 {
      display: none;
    }
  }
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    color: black;
    text-decoration: none;
    img {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
