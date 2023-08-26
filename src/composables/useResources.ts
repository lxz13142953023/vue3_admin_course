// 引入接口
import { getResourcePages } from '@/api/resources'
import { ref, reactive } from 'vue'
import type { Condition, QueriedResult } from '@/api/resources'
import { ElMessage } from 'element-plus'
// 查询条件
export const queryCondition = reactive<Condition>({
  name: '',
  url: '',
  categoryId: '',
  current: 1,
  size: 5
})

// 查询结果
export const queriedResult = ref<QueriedResult>({
  current: 1,
  records: [],
  size: 0,
  total: 0
})

// 查询方法
export const queryResource = async (params: Condition = {}) => {
  Object.assign(queryCondition, params) //合并，属性名称相同的会覆盖
  const { data } = await getResourcePages(queryCondition)
  if (data.code === '000000') {
    queriedResult.value = data.data
  } else {
    ElMessage.error('获取资源失败！')
    throw new Error('获取资源失败！')
  }
}
