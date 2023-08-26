<script setup lang="ts">
import { ref, reactive } from 'vue'
import { saveOrUpdate, getRoleById } from './../../api/roles'
import { queryRoles } from './../../composables/useRoles'
import { ElMessage } from 'element-plus'
const dialogFormVisible = ref(false)
const formLabelWidth = '100px'

const initData = () => ({
  code: '',
  name: '',
  description: ''
})

const form = reactive(initData())

const isCreate = ref(true)
const msgText = ref('')
const initAndShow = async (id = 0) => {
  dialogFormVisible.value = true //调用方法，展示对话框
  Object.assign(form, initData()) //清空表单信息
  if (id) {
    isCreate.value = false
    msgText.value = '更新'
    const { data } = await getRoleById(id)
    if (data.code === '000000') {
      Object.assign(form, data.data)
    } else {
      ElMessage.error(`获取ID为${id}的角色信息失败！`)
      throw new Error(`获取ID为${id}的角色信息失败！`)
    }
  } else {
    isCreate.value = true
    msgText.value = '更新'
  }
}

// 提交表单
const onSubmit = async () => {
  let { data } = await saveOrUpdate(form).finally(function () {
    dialogFormVisible.value = false
  })
  if (data.code === '000000') {
    ElMessage.success(`${msgText.value}创建成功！`)
    queryRoles()
  } else {
    ElMessage.error(`${msgText.value}创建失败！`)
    throw new Error(`${msgText.value}创建失败！`)
  }
}

defineExpose({
  initAndShow
})
</script>

<template>
  <div>
    <el-dialog v-model="dialogFormVisible" :title="msgText + '角色'">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色编码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="form.code" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
          <el-input v-model="form.description" autocomplete="off" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
