<script setup lang="ts">
import { RouterView } from 'vue-router'
// 导入中午语言包
import zhCn from 'element-plus/dist/locale/zh-cn'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView></RouterView>
  </el-config-provider>
</template>

<style scoped lang="scss"></style>
