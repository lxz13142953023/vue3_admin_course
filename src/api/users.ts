import { useTokenStore } from '@/stores/mytoken'
import request from '@/utils/request'

// 提取公共的类型(泛型T相当于形参)
type CommonReturn<T> = {
  success: boolean
  state: number
  message: string
  content: T
}

// 用户登录-请求参数类型
type LoginInfo = {
  phone: string
  code?: string
  password: string | number
}
// 用户登录-返回数据类型
type LoginResult = CommonReturn<string>
// 用户请求登录
export const login = (LoginInfo: LoginInfo) => {
  return request<LoginResult>({
    method: 'POST',
    url: '/front/user/login',
    data: `phone=${LoginInfo.phone}&password=${LoginInfo.password}`
  })
}

// 获取用户信息
type UserInfo = CommonReturn<content>
type content = {
  isUpdatePassword: boolean
  portrait: string
  userName: string
}

export const getInfo = () => {
  return request<UserInfo>({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

// 用户退出
export const logout = () => {
  return request({
    method: 'POST',
    url: '/front/user/logout'
  })
}

// 刷新Token
type RToken = CommonReturn<string>

/**
 * 这里是为了防止多次同时触发刷新token
 */
let promiseRT: Promise<any> //将未执行完的request存为一个对象，如果isRefreshing为true，就将未执行完的request继续执行
let isRefreshing = false

export const refreshToken = () => {
  if (isRefreshing) {
    return promiseRT
  }
  isRefreshing = true
  promiseRT = request<RToken>({
    method: 'POST',
    url: '/front/user/refresh_token',
    params: {
      refreshtoken: useTokenStore().token?.refresh_token
    }
  }).finally(() => {
    isRefreshing = false
  })
  return promiseRT
}

export type QueryCondition = Partial<{
  currentPage: number
  pageSize: number
  phone: string
  userId: number
  startCreateTime: string
  endCreateTime: string
}>

type Common<T> = {
  code: string
  data: T
  mesg: string
  time: string
}
// 用户查询结果的类型
export type QueryResult = {
  current: number
  hitCount: false
  optimizeCountSql: boolean
  orders: any[]
  pages: number
  records: any[] | UserItem
  searchCount: boolean
  size: number
  total: number
}
// 用户查询结果里面records的类型
type UserItem = {
  accountNonExpired: boolean
  accountNonLocked: boolean
  createTime: string
  credentialsNonExpired: boolean
  id: number
  isDe: boolean
  name: string
  password: string
  phone: string
  protrait: string | null
  regIp: string | null
  status: 'ENABLE' | 'DISABLE'
  updateTime: string
}
// 获取用户信息列表
export const getUserPages = (queryCondition: QueryCondition) => {
  return request<Common<QueryResult>>({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data: queryCondition
  })
}

// 启用用户
export const enableUser = (userId: number) => {
  return request<Common<boolean>>({
    method: 'GET',
    url: '/boss/user/enableUser',
    params: {
      userId: userId
    }
  })
}
// 禁用用户
export const forbidUser = (userId: number) => {
  return request<Common<boolean>>({
    method: 'POST',
    url: '/boss/user/forbidUser',
    data: {
      userId
    }
  })
}

export type UserRoles = {
  hasPermission: boolean
  id: number
  name: string
}
// 根据指定用户ID获取指定用的角色信息
export const getRolesWithUserPermission = (userId: number) => {
  return request<Common<UserRoles[]>>({
    method: 'GET',
    url: '/boss/role/getRolesWithUserPermission',
    params: {
      userId
    }
  })
}

// 给用户分配角色
export const allocateUserRoles = (userId: number, roleIdList: number[]) => {
  return request<Common<boolean>>({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data: {
      userId,
      roleIdList
    }
  })
}
