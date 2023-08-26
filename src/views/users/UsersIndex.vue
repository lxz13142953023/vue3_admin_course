<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { enableUser, forbidUser } from './../../api/users'
import { ref, watch } from 'vue'
import DlgAllocRoles from './DlgAllocRoles.vue'
// 默认用户头像
const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
import { queryUsers, queriedResult, queryCondition } from './../../composables/useUsers'
queryUsers()
// 切换用户状态
const handleChange = async (value: string, useId: number) => {
  if (value == 'DISABLE') {
    let res = await forbidUser(useId)
    if (res.status === 200) {
      ElMessage.success('禁用成功！')
    } else {
      ElMessage.error('禁用失败！')
    }
  } else if (value == 'ENABLE') {
    let res = await enableUser(useId)
    if (res.status === 200) {
      ElMessage.success('启用成功！')
    } else {
      ElMessage.error('启用失败！')
    }
  }
}

// 时间选取器的范围
const timeRange = ref(null)
// 当时间范围变化时，修改相应的时间条件
watch(timeRange, (newTime) => {
  if (Array.isArray(newTime)) {
    queryCondition.value.startCreateTime = newTime[0].toISOString()
    queryCondition.value.endCreateTime = newTime[1].toISOString()
  } else {
    queryCondition.value.startCreateTime = ''
    queryCondition.value.endCreateTime = ''
  }
})

// 获取子组件模板引用
const dlgAllocRoles = ref()
</script>

<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <el-form :inline="true" :model="queryCondition" class="demo-form-inline">
          <el-form-item label="手机号">
            <el-input v-model="queryCondition.phone" placeholder="请输入手机号" clearable />
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="timeRange"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryUsers({ currentPage: 1 })">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <el-table :data="queriedResult.records" border style="width: 100%">
        <el-table-column prop="id" label="用户ID" align="center" />
        <el-table-column shape="circle" label="头像" align="center">
          <template #default="scope">
            <el-avatar
              shape="square"
              :size="50"
              :src="scope.row.portrait ? scope.row.portrait : circleUrl"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户名" align="center" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="createTime" label="注册时间" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              class="mb-2"
              active-value="ENABLE"
              inactive-value="DISABLE"
              active-text="启用"
              inactive-text="禁用"
              @change="handleChange(scope.row.status, scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button @click="dlgAllocRoles.initAndShow(scope.row.id)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 17px"
        v-model:current-page="queriedResult.current"
        v-model:page-size="queriedResult.size"
        :page-sizes="[5, 10, 20, 50]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        @size-change="(size) => queryUsers({ pageSize: size, currentPage: 1 })"
        @current-change="(size) => queryUsers({ currentPage: size })"
      />
      <DlgAllocRoles ref="dlgAllocRoles"></DlgAllocRoles>
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
