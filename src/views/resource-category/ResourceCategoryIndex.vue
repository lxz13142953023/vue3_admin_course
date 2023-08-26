<script setup lang="ts">
import { ref } from 'vue'
import { deleteCategory } from './../../api/resource-category'
import {
  allResourceCategory,
  getAllResourceCategory
} from './../../composables/useResourceCategory'
import { timeFormatter } from './../../utils/timeHandlers'
import DlgResourceCategoryCreateOrEdit from './DlgResourceCategoryCreateOrEdit.vue'
const dlgCreateOrEdit = ref<InstanceType<typeof DlgResourceCategoryCreateOrEdit>>() //模板的类型
getAllResourceCategory()

const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定要删除吗？', '危险动作提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).catch(() => {
    ElMessage.info('取消删除！')
    return new Promise(() => {}) //阻止取消后继续向下执行
  })
  const { data } = await deleteCategory(id)
  if (data.code === '000000') {
    ElMessage.success('删除资源类型成功！')
    getAllResourceCategory()
  } else {
    ElMessage.error('删除资源类型失败！')
    throw new Error('删除资源类型失败！')
  }
}
</script>

<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h3>资源类别列表</h3>
          <el-button class="button" type="primary" @click="dlgCreateOrEdit.initAndShow(0)"
            >创建类别</el-button
          >
        </div>
      </template>
      <el-table :data="allResourceCategory" border style="width: 100%">
        <el-table-column type="index" label="编号" align="center" />
        <el-table-column prop="name" label="类别名称" align="center"></el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间"
          :formatter="timeFormatter"
          align="center"
        ></el-table-column>
        <el-table-column prop="sort" label="排序" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" @click="dlgCreateOrEdit?.initAndShow(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <DlgResourceCategoryCreateOrEdit ref="dlgCreateOrEdit"></DlgResourceCategoryCreateOrEdit>
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
