<script setup lang="ts">
import { useMenus } from './../../composables/useMenus'
import { useRoute } from 'vue-router'
// 获取一级菜单
// 1.先获取所有菜单
const { getAllMenus, topMenus, form, onSubmit, getMenuInfoById, msgText } = useMenus()
getAllMenus()
const route = useRoute()
// 切换到编辑页面通过id获取当先信息
getMenuInfoById(route.params.id as string)
</script>

<template>
  <div>
    <el-form :model="form" label-width="120px" size="large">
      <el-form-item label="菜单名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="菜单路径">
        <el-input v-model="form.href" />
      </el-form-item>
      <el-form-item label="上级菜单">
        <el-select v-model="form.parentId" placeholder="please select your zone">
          <el-option label="顶层菜单" :value="-1" />
          <el-option v-for="menu in topMenus" :label="menu.name" :value="menu.id" :key="menu.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="图标名称">
        <el-input v-model="form.icon" />
      </el-form-item>
      <el-form-item label="是否显示">
        <el-radio-group v-model="form.shown">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.orderNum" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即{{ msgText }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.el-form {
  background-color: white;
  padding: 70px;
}
</style>
