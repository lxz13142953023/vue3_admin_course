<script setup lang="ts">
import { ref } from 'vue'
import { getRoleMenus, allocateRoleMenus } from './../../api/roles'
import type { RoleMenuItem } from './../../api/roles'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  roleId: {
    type: String,
    required: true
  }
})
// 创建与模板引用相同的变量名称
const menuTree = ref()

// 获取所有被选中的菜单Id,保存到树形结构的数组中
const getCheackedIds = (arrData: RoleMenuItem[]) => {
  arrData.forEach((roleMenu) => {
    if (roleMenu.subMenuList) {
      getCheackedIds(roleMenu.subMenuList)
    } else if (roleMenu.selected) {
      checkedIds.value.push(roleMenu.id)
    }
  })
}
// 存储数据
const roleMenus = ref<RoleMenuItem[]>([])
// 默认被选中的Key
const checkedIds = ref<number[]>()
// 获取数据的方法
const loadRoleMenus = async () => {
  const { data } = await getRoleMenus(props.roleId)
  if (data.code === '000000') {
    roleMenus.value = data.data
    getCheackedIds(data.data) //获取所有被选中的菜单的id
  } else {
    ElMessage.error('获取角色菜单权限信息失败！')
    throw new Error('获取角色菜单权限信息失败！')
  }
}
// 保存更新后的数据
const onSave = async () => {
  // 首先获取当前最新的选项
  const currentCheckedIds = menuTree.value?.getCheckedKeys()
  // 把最新的数据（id数组）通过接口发送给服务端更新
  let { data } = await allocateRoleMenus(props.roleId, currentCheckedIds as number[])
  if (data.code === '000000') {
    ElMessage.success('更新角色菜单权限成功！')
    router.push({ name: 'roles' })
  } else {
    ElMessage.error('更新角色菜单权限失败！')
    throw new Error('更新角色菜单权限失败！')
  }
}
// 清空所有
const onClear = () => {
  menuTree.value?.setCheckedKeys([])
}
loadRoleMenus()
</script>

<template>
  <div>
    <el-tree
      ref="menuTree"
      :data="roleMenus"
      :props="{ label: 'name', children: 'subMenuList' }"
      lazy
      default-expand-all
      show-checkbox
      node-key="id"
      :default-checked-keys="checkedIds"
    />
    <el-button type="primary" @click="onSave">保存</el-button>
    <el-button @click="onClear">清空</el-button>
  </div>
</template>

<style scoped lang="scss">
.el-tree {
  margin-bottom: 17px;
}
</style>
