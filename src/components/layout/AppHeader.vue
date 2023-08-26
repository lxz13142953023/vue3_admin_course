<script setup lang="ts">
import { ref } from 'vue'
import { getInfo, logout } from '../../api/users'
// import { ElMessageBox } from 'element-plus'
import { useTokenStore } from '../../stores/mytoken'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const isCollapse = ref(false)
// 定义被触发传值的事件
const emit = defineEmits(['TransmitState'])
// 创建用户信息的初始值
const userInfo = ref({
  portrait: '',
  userName: ''
})
const router = useRouter()
// 点击退出按钮
const handleLogout = async () => {
  // 1.询问是否确定要退出
  await ElMessageBox.confirm('确认要退出吗？', '退出询问', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).catch(() => {
    ElMessage.info('取消退出！')
    return new Promise(() => {}) //阻止事件继续向下执行，不能单纯的使用return,因为单使用return也会返回一个成功的promise对象
  })
  // 2.执行退出
  await logout().catch(() => {})
  // 3.清空token,跳转到login
  const store = useTokenStore()
  ElMessage.success('用户退出成功！')
  store.saveToken('')
  router.push('/login')
}

// 定义展开与关闭侧边栏事件
const ChangeState = () => {
  isCollapse.value = !isCollapse.value
  emit('TransmitState')
}

// 页面加载时调用接口请求用户信息
getInfo().then((res) => {
  userInfo.value = res.data.content
})
</script>

<template>
  <div>
    <el-header>
      <!-- 图标 -->
      <el-icon @click="ChangeState">
        <Expand v-show="!isCollapse" />
        <Fold v-show="isCollapse" />
      </el-icon>
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" style="margin-left: 10px">
        <el-breadcrumb-item
          v-for="(item, index) in route.matched"
          :key="index"
          :to="{ path: item.path }"
          >{{ item.meta.title }}</el-breadcrumb-item
        >
      </el-breadcrumb>
      <!-- 下拉菜单 -->
      <el-dropdown>
        <span>
          <el-avatar :size="40" :src="userInfo.portrait" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
  </div>
</template>

<style scoped lang="scss">
.el-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #fde2e2;
  .el-dropdown {
    margin-left: auto;
    span {
      margin-right: 5px;
    }
  }
}
</style>
