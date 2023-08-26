<script setup lang="ts">
// 导入获取数据的方法
import { queryCondition, queriedResult, queryRoles } from './../../composables/useRoles'
// 引入格式化时间函数
import { timeFormatter } from './../../utils/timeHandlers'
// 引入对话框组件
import DlgRoleCreateOrEdit from './DlgRoleCreateOrEdit.vue'
import { deleteRole } from './../../api/roles'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import router from '../../router'
// 获取子组件模板
const dlgCreateOrEdit = ref()

// 删除

const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确认要删除吗？', '删除询问', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).catch(() => {
    ElMessage.success('取消删除！')
    return new Promise(() => {})
  })

  // 通过接口执行删除
  let { data } = await deleteRole(id)
  if (data.code === '000000') {
    ElMessage.success('删除角色成功！')
    queryRoles({ current: 1 })
  } else {
    ElMessage.error('删除角色失败！')
    throw new Error('删除角色失败！')
  }
}

// 分配资源待开发
const allocate = () => {
  ElMessage.success('分配资源功能模块暂未开发！')
}
queryRoles()
</script>

<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <el-button @click="dlgCreateOrEdit?.initAndShow()">新建角色</el-button>
        <el-form :inline="true" :model="queryCondition" class="demo-form-inline">
          <el-form-item label="输入搜索">
            <el-input v-model="queryCondition.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="queryRoles({ name: '' })">重置</el-button>
            <el-button type="primary" @click="queryRoles({ current: 1 })">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <el-table :data="queriedResult.records" border style="width: 100%">
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="name" label="角色名称" align="center" />
        <el-table-column
          prop="createdTime"
          label="添加时间"
          :formatter="timeFormatter"
          align="center"
        />
        <el-table-column prop="description" label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="router.push({ name: 'alloc-menus', params: { roleId: scope.row.id } })"
              >分配菜单</el-button
            >
            <el-button type="primary" link @click="allocate">分配资源</el-button>
            <el-button type="primary" link @click="dlgCreateOrEdit?.initAndShow(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="primary" link @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="queryCondition.current"
        v-model:page-size="queryCondition.size"
        :page-sizes="[5, 10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        @size-change="
          (size) => {
            queryRoles({ size })
          }
        "
        @current-change="
          (current) => {
            queryRoles()
          }
        "
      />
    </el-card>
    <DlgRoleCreateOrEdit ref="dlgCreateOrEdit"></DlgRoleCreateOrEdit>
  </div>
</template>

<style scoped lang="scss">
.el-form {
  float: right;
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
.el-table {
  margin-top: 17px;
}
</style>
