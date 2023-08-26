import axios, { type AxiosRequestHeaders } from 'axios'
import { useTokenStore } from '@/stores/mytoken'
import { refreshToken } from '@/api/users'
import { ElMessage } from 'element-plus'
import router from '@/router/index'
// 创建请求实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// 请求拦截器
request.interceptors.request.use((config) => {
  const store = useTokenStore()
  if (!config.headers) {
    config.headers = {} as AxiosRequestHeaders
  }
  config.headers.Authorization = store.token?.access_token

  return config //配置好请求头信息后，再将config也就是配置项重新返回出去
})

// 相应拦截器
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status == 401) {
      // 如果请求返回报错，说明token过期，所以下面调用重新获取token的接口，刷新token
      const { data } = await refreshToken()
      // 如果获取到成功的token
      if (data.success) {
        // 保存新token
        useTokenStore().saveToken(data.content)
        // 重新请求之前的接口，并且把结果返回(请求的信息都被存放在error的配置信息里)
        return request(error.config)
      } else {
        // 跳转到login
        ElMessage.error('刷新Token失败，需要重新登陆！')
        router.push({ name: 'Login' })
        return
      }
    } else if (error.response.status == 403) {
      ElMessage.error('当前权限不足！')
      return
    }
    return Promise.reject(error)
  }
)

export default request
