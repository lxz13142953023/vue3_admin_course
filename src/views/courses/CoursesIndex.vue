<script setup lang="ts">
import { queryCondition, queriedResult, queryCourses } from './../../composables/useCourses'
import { changeState } from './../../api/courses'
import { useRouter } from 'vue-router'

const router = useRouter()

queryCourses({ currentPage: 1 })

// 上架/下架的事件处理函数
const changeStatus = async (val: number, course: any) => {
  const xx = [
    { msg: '下架', oldVal: 1 },
    { msg: '上架', oldVal: 0 }
  ]
  const { data } = await changeState(course.id, val).catch(() => {
    course.status = xx[val].oldVal
    ElMessage.error(`${xx[val].msg}失败！`)
    throw new Error(`${xx[val].msg}失败！`)
  })
  if (data.code === '000000') {
    ElMessage.success(`${xx[val].msg}成功！`)
  } else {
    course.status = xx[val].oldVal
    ElMessage.error(`${xx[val].msg}失败！`)
    throw new Error(`${xx[val].msg}失败！`)
  }
}
const dlg = () => {
  ElMessage.success('此功能还未开发！')
}
</script>

<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-form :inline="true" :model="queryCondition" class="demo-form-inline">
            <el-form-item label="课程名称">
              <el-input v-model="queryCondition.courseName" placeholder="课程名称" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="queryCondition.status">
                <el-option label="全部" value=""></el-option>
                <el-option label="上架" :value="1"></el-option>
                <el-option label="全部" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="() => queryCourses({ currentPage: 1 })"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="router.push({ name: 'course-create' })"
            >新建课程</el-button
          >
        </div>
      </template>
      <el-table :data="queriedResult.records" border style="width: 100%">
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="courseName" label="课程名称" align="center" />
        <el-table-column prop="price" label="价格" align="center" />
        <el-table-column prop="sortNum" label="排序" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              class="mb-2"
              active-text="上架"
              inactive-text="下架"
              :active-value="1"
              :inactive-value="0"
              @change="changeStatus(scope.row.id, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              @click="router.push({ name: 'course-edit', params: { courseId: scope.row.id } })"
              >编辑</el-button
            >
            <el-button @click="dlg">内容管理</el-button>
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
        :total="queriedResult.total || 0"
        @size-change="(size) => queryCourses({ pageSize: size, currentPage: 1 })"
        @current-change="(size) => queryCourses({ currentPage: size })"
      />
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
