<script setup lang="ts">
import { reactive, ref } from 'vue'
// 所有资源分类，获取所有资源分类
import {
  allResourceCategory,
  getAllResourceCategory
} from './../../composables/useResourceCategory'
import { saveOrUpdate, getResourceById } from './../../api/resources'
import { queryResource } from './../../composables/useResources'
getAllResourceCategory() //获取所有资源分类
const dialogFormVisible = ref(false)
const formLabelWidth = '80px'
const initData = () => ({
  id: 0,
  name: '',
  categoryId: 1,
  url: '',
  description: ''
})
const form = reactive(initData())

const isCreate = ref(true)
const msgText = ref('')
const initAndShow = async (id: number) => {
  Object.assign(form, initData())
  dialogFormVisible.value = true
  if (id) {
    isCreate.value = false
    msgText.value = '更新'
    // 根据传进来的I的，获取要更新的资源
    const { data } = await getResourceById(id)
    if (data.code === '000000') {
      Object.assign(form, data.data)
    } else {
      ElMessage.error(`获取ID为${id}的资源信息失败！`)
      throw new Error(`获取ID为${id}的资源信息失败！`)
    }
  } else {
    isCreate.value = true
    msgText.value = '创建'
  }
}
// 向外暴露此方法
defineExpose({
  initAndShow: initAndShow
})

// 表单提交
const onSubmit = async () => {
  let res = await saveOrUpdate(form).finally(() => {
    dialogFormVisible.value = false
  })
  if (res.data) {
    ElMessage.success('提交成功！')
    queryResource({ current: 1 })
  } else {
    ElMessage.error('提交失败！')
    throw new Error('提交失败！')
  }
}
</script>

<template>
  <div>
    <el-dialog v-model="dialogFormVisible" :title="msgText + '资源'">
      <el-form :model="form">
        <el-form-item label="资源名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="资源路径" :label-width="formLabelWidth" prop="url">
          <el-input v-model="form.url" autocomplete="off" />
        </el-form-item>
        <el-form-item label="资源类别" :label-width="formLabelWidth" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="资源类别">
            <el-option label="空" value="" />
            <el-option
              v-for="category in allResourceCategory"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="资源描述" :label-width="formLabelWidth" prop="description">
          <el-input v-model="form.description" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
