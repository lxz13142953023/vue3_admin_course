<script setup lang="ts">
// 导入创建或更新对话框组件
import DlgResourceCreateOrEdit from './DlgResourceCreateOrEdit.vue'
import { queryCondition, queriedResult, queryResource } from './../../composables/useResources'
import { timeFormatter } from './../../utils/timeHandlers'
import {
  allResourceCategory,
  getAllResourceCategory
} from './../../composables/useResourceCategory'
// 调用删除接口
import { deleteResource } from './../../api/resources'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const queryFm = ref()
queryResource() //根据条件获取所有资源
getAllResourceCategory()

const dlgCreateOrEdit = ref() //对话框引用模板
// 删除资源
const handleDelete = async (id: number) => {
  // 1.进行询问并确认
  await ElMessageBox.confirm('确定要删除吗？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).catch(() => {
    ElMessage.info('取消删除！')
    return new Promise(() => {}) //给一个空的promise，就不会继续向下执行
  })
  // 2.确认后进行真是的删除请求
  const { data } = await deleteResource(id)
  if (data.code === '000000') {
    ElMessage.success('删除资源成功！')
    queryResource({ current: 1 })
  } else {
    ElMessage.error('删除资源失败！')
    throw new Error('删除资源失败！')
  }
}
</script>
<template>
  <el-card class="box-card">
    <template #header>
      <el-form :inline="true" :model="queryCondition" class="demo-form-inline" ref="queryFm">
        <el-form-item label="资源名称" prop="name">
          <el-input placeholder="资源名称" v-model="queryCondition.name"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input placeholder="资源路径" v-model="queryCondition.url"></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="queryCondition.categoryId" placeholder="资源分类">
            <el-option label="不限" value=""></el-option>
            <el-option
              v-for="item in allResourceCategory"
              :value="item.id"
              :key="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryFm?.resetFields()">重置</el-button>
          <el-button type="primary" @click="queryResource()">搜索查询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-button size="large" @click="dlgCreateOrEdit.initAndShow(0)">添加资源</el-button>
    <el-button size="large" @click="router.push({ name: 'resource-category' })">资源类别</el-button>
    <el-table :data="queriedResult.records" border style="width: 100%">
      <el-table-column type="index" label="编号" align="center" />
      <el-table-column prop="name" label="资源名称" align="center" />
      <el-table-column prop="url" label="资源路径" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column
        prop="createdTime"
        :formatter="timeFormatter"
        label="添加时间"
        align="center"
      />
      <el-table-column prop="name" label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" @click="dlgCreateOrEdit?.initAndShow(scope.row.id)"
            >编辑</el-button
          >
          <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="queriedResult.current"
      v-model:page-size="queriedResult.size"
      :page-sizes="[5, 10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queriedResult.total"
      @size-change="
        (pageSize) => {
          queryResource({ size: pageSize, current: 1 })
        }
      "
      @current-change="
        (pageNumber) => {
          queryResource({ current: pageNumber })
        }
      "
    />
    <DlgResourceCreateOrEdit ref="dlgCreateOrEdit"></DlgResourceCreateOrEdit>
  </el-card>
</template>

<style scoped lang="scss">
.el-table {
  margin-top: 17px;
}
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
