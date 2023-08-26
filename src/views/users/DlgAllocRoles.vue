<script setup lang="ts">
import { ref, reactive } from 'vue'
import { getRolesWithUserPermission, allocateUserRoles } from './../../api/users'
import type { UserRoles } from './../../api/users'
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = reactive({
  userId: undefined as number,
  roleIdList: [] as number[]
})

// 保存所有角色信息
const allRoles = ref([] as UserRoles[])

// 封装显示的方法
const initAndShow = async (userId: number) => {
  dialogFormVisible.value = true
  let { data } = await getRolesWithUserPermission(userId)
  if (data.code === '000000') {
    allRoles.value = data.data
    form.userId = userId
    form.roleIdList = data.data.filter((item) => item.hasPermission).map((i) => i.id)
  } else {
    ElMessage.error('获取用户的角色信息失败！')
    throw new Error('获取用户的角色信息失败！')
  }
}

// 给用户分配角色
const StartAlloc = async () => {
  const { data } = await allocateUserRoles(form.userId as number, form.roleIdList).finally(() => {
    dialogFormVisible.value = false
  })
  if (data.code === '000000') {
    ElMessage.success('给用户分配角色成功！')
  } else {
    ElMessage.error('给用户分配角色失败！')
    throw new Error('给用户分配角色失败！')
  }
}

// 把方法向外暴露
defineExpose({
  initAndShow
})
</script>

<template>
  <div>
    <el-dialog v-model="dialogFormVisible" title="分配角色">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth">
          <el-select v-model="form.roleIdList" placeholder="请选择角色" :multiple="true">
            <el-option
              v-for="role in allRoles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="StartAlloc"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
