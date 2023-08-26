// 导入接口函数
import { getAll } from '@/api/resource-category'
import { ref } from 'vue'
import type { ResourceCategory } from './../api/resource-category'
import { ElMessage } from 'element-plus'

// 保存所有资源类别信息
export const allResourceCategory = ref([] as ResourceCategory[])

// 获取所有资源类别信息
export const getAllResourceCategory = async () => {
  const { data } = await getAll()
  if (data.code === '000000') {
    allResourceCategory.value = data.data
  } else {
    ElMessage.error('获取资源列表失败！')
    throw new Error('获取资源列表失败！')
  }
}
