import { getQueryCourses } from '@/api/courses'
import type { QueryCondition, CoursesResult } from '@/api/courses'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
// 查询条件
export const queryCondition = ref({
  currentPage: 1,
  pageSize: 5,
  status: ''
} as QueryCondition)
// 查询结果
export const queriedResult = ref({} as CoursesResult)
// 查询方法
export const queryCourses = async (params: QueryCondition) => {
  Object.assign(queryCondition.value, params)
  const { data } = await getQueryCourses(queryCondition.value)
  if (data.code === '000000') {
    queriedResult.value = data.data
  } else {
    ElMessage.error('获取课程列表信息失败！')
    throw new Error('获取课程列表信息失败！')
  }
}
