<script setup lang="ts">
import { useMenus } from './../../composables/useMenus'
import { useRouter } from 'vue-router'
const router = useRouter()
const { allMenus, getAllMenus, handleDelete } = useMenus()
getAllMenus()
</script>

<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-button class="button" @click="router.push({ name: 'menu-create' })"
            >添加菜单</el-button
          >
        </div>
      </template>
      <el-table :data="allMenus" border style="width: 100%">
        <el-table-column type="index" label="编号" width="180" align="center" />
        <el-table-column prop="name" label="菜单名称" align="center" />
        <el-table-column prop="level" label="菜单层级" align="center" />
        <el-table-column prop="icon" label="菜单图标" align="center" />
        <el-table-column prop="orderNum" label="排序" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              @click="router.push({ name: 'menu-edit', params: { id: scope.row.id } })"
              >编辑</el-button
            >
            <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: auto;
}
</style>
