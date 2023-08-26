import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

interface Token {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  user_id: string
}

export const useTokenStore = defineStore('mytoken', () => {
  // ref 相当于 state
  const tokenJson = ref('')
  // computed相当于getters
  const token = computed<Token>(() => {
    try {
      return JSON.parse(tokenJson.value || window.localStorage.getItem('TokenInfo') || '{}')
    } catch (err) {
      ElMessage.error('token格式不对，转换失败！')
      window.localStorage.setItem('TokenInfo', '') //防止一直刷新一直报错，清空了就位空了
      throw err
    }
  })
  // function相当于actions
  function saveToken(data: string) {
    tokenJson.value = data
    window.localStorage.setItem('TokenInfo', data)
  }

  // 向外暴露
  return { token, saveToken }
})
