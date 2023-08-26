import request from '@/utils/request'

interface Common<T> {
  code: string
  mesg: string
  time: string
  data: T
}

export interface CoursesResult {
  records: CourseItem[]
  total: number
  size: number
  current: number
  pages: number
}

export interface CourseItem {
  id: number
  courseName: string
  brief: string
  courseDescription: string
  teacherId?: any
  totalCourseTime?: any
  sales: number
  actualSales?: any
  price: number
  priceTag: string
  discounts: number
  discountsTag: string
  courseImgUrl: string
  shareTitle?: any
  shareDescription?: any
  shareImageTitle?: any
  isNew?: boolean
  isNewDes?: string
  lastOperatorId?: any
  createTime: string
  updateTime: string
  autoOnlineTime?: any
  isDel: boolean
  totalDuratipm?: any
  seoDescription?: any
  seoKeywords?: any
  seoTitle?: any
  h5Url?: any
  courseListImg: string
  tag?: any
  status: number
  sortNum: number
  brokerageRate?: any
  joinDistribution?: any
  lastNoticeTime?: any
  previewFirstField: string
  previewSecondField: string
  distributionPosterImage?: any
  distributionCopywriter?: any
  isGray?: any
  sectionDTOS?: any
  teacherDTO?: any
  courseUrl?: any
  topNCourseLesson?: any
  isBuy: boolean
  lessonUpdateCount?: any
  compareTime?: any
  lastLearnLessonName?: any
  courseDescriptionMarkDown: string
  activityCourse: boolean
  activityTime?: any
  activityCourseDTO?: any
}
export type QueryCondition = Partial<{
  currentPage: number
  pageSize: number
  courseName: string
  status: number | ''
}>
// 分页查询课程信息
export const getQueryCourses = (params: QueryCondition = {}) => {
  return request<Common<CoursesResult>>({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data: params
  })
}

// 课程上下架
export const changeState = (courseId: number, status: number) => {
  return request<Common<boolean>>({
    method: 'GET',
    url: '/boss/course/changeState',
    params: {
      courseId,
      status
    }
  })
}

interface Course {
  courseName: string
  brief: string
  teacherDTO: TeacherDTO
  previewFirstField: string
  previewSecondField: string
  sortNum: number
  courseListImg: string
  courseImgUrl: string
  discounts: number
  price: number
  sales: number
  discountsTag: string
  activityCourse: boolean
  activityCourseDTO: ActivityCourseDTO
  courseDescriptionMarkDown: string
  status: number
}

interface ActivityCourseDTO {
  beginTime: string
  endTime: string
  amount: number
  stock: number
}

interface TeacherDTO {
  teacherName: string
  position: string
  description: string
}
// 保存或更新课程信息
export const saveOrUpdateCourse = (course: Course) => {
  return request<Common<boolean>>({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data: course
  })
}

// 获取指定ID的课程信息
export const getCourseById = (courseId: string) => {
  return request<Common<Course>>({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}
