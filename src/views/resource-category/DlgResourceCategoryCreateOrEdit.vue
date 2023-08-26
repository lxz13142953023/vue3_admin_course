<script setup lang="ts">
import { reactive, ref } from 'vue'
import { saveOrderUpdate } from './../../api/resource-category'
import {
  getAllResourceCategory,
  allResourceCategory
} from './../../composables/useResourceCategory'
import { FormInstance } from 'element-plus'
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = reactive({
  name: '',
  sort: 0
})

const fmResourceCategory = ref<FormInstance>()

const isCreate = ref(true)
const msgText = ref('')
const initAndShow = (id = 0) => {
  fmResourceCategory.value?.resetFields()
  dialogFormVisible.value = true
  if (id) {
    isCreate.value = false
    msgText.value = '编辑'
    const resourceCategory = allResourceCategory.value.find((item) => item.id === id)
    Object.assign(form, resourceCategory) //合并数组，使其保持响应式
  } else {
    isCreate.value = true
    msgText.value = '创建'
  }
}

// 提交按钮事件处理函数
const onSubmit = async () => {
  let { data } = await saveOrderUpdate(form).finally(() => (dialogFormVisible.value = false))
  if (data.code === '000000') {
    ElMessage.success(`${msgText.value}资源类型成功！`)
    getAllResourceCategory()
  } else {
    ElMessage.error(`${msgText.value}资源类型失败...`)
    throw new Error(`${msgText.value}资源类型失败...`)
  }
}
defineExpose({
  initAndShow: initAndShow
})
</script>

<template>
  <div>
    <el-dialog v-model="dialogFormVisible" :title="msgText + '资源类别'">
      <el-form :model="form" ref="fmResourceCategory">
        <el-form-item label="类别名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input v-model="form.sort" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
