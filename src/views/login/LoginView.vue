<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
// 引入登录请求函数
import { login } from './../../api/users'
// 导入pinia
import { useTokenStore } from './../../stores/mytoken'
// 导入路由
import { useRouter, useRoute } from 'vue-router'
// 定义pinia实例
const store = useTokenStore()
// 登录表单响应式
let form = reactive({
  phone: '18201288771',
  password: '111111'
})
// 定义路由实例
const router = useRouter()
const route = useRoute()
// 定义是否加载中
let isLoading = ref(false)
// 获取form表单元素
const formRef = ref<FormInstance>()
// 定义表单校验规则
const rules = reactive<FormRules>({
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '手机号必须是11位数字' }
  ],
  password: [
    { required: true, message: '密码密码不能为空', trigger: 'blur' },
    { min: 6, max: 18, message: '密码长度需要6-18位', trigger: 'blur' }
  ]
})
// 登陆按钮点击事件
const onSubmit = async () => {
  isLoading.value = true
  // 表单校验，是一个promise
  await formRef.value?.validate().catch((err) => {
    ElMessage({
      type: 'error',
      message: '表单校验失败！'
    }) //element组件库的方法，是个promise，出现错误报错
    isLoading.value = false
    throw err //promise出现错误，抛出错误，阻止程序向下运行
  })

  // 正式发送登录请求
  const data = await login(form).then((res) => {
    if (!res.data.success) {
      ElMessage.error('登录信息有误！')
      throw new Error('登录信息有误！')
    }
    return res.data
  })
  isLoading.value = false
  // 保存token信息
  store.saveToken(data.content)
  ElMessage.success('登陆成功！')
  if (route.query.redirect) {
    router.push(route.query.redirect as string) //此处需要标记为字符串，不然会飘红线
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="login">
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="120px"
      label-position="top"
      size="large"
    >
      <h2>登录</h2>
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="isLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.login {
  background-color: #fde2e2;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    width: 300px;
    height: 300px;
    background-color: #fef0f0;
    border-radius: 10px;
    padding: 30px;
    .el-form-item {
      margin-top: 20px;
    }
    .el-button {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
