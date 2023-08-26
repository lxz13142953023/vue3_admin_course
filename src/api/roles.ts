import request from '@/utils/request'

export type Condition = Partial<{
  code: string
  id: number
  name: string
  startCreateTime: string
  endCreateTime: string
  current: number
  size: number
}>

type Common<T> = {
  code: string
  data: T
  mesg: string
  time: string
}

export type QueryResult = Partial<{
  current: number
  hitCount: boolean
  optimizeCountSql: boolean
  orders: any[]
  pages: number
  records: Role[] | []
  searchCount: boolean
  size: number
  total: number
}>

export type Role = {
  code: string
  createdBy?: string
  createdTime?: string
  description: string
  id?: number
  name: string
  operatorId?: number | null
  updatedBy?: string
  updatedTime?: string
}

// 按条件查询角色信息
export const getRolePages = (condition: Condition) => {
  return request<Common<QueryResult>>({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data: condition
  })
}

type RoleParams = Pick<Role, 'code' | 'description' | 'name' | 'id'>
// 保存或更新角色
export const saveOrUpdate = (role: RoleParams) => {
  return request<Common<boolean>>({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data: role
  })
}

// 删除角色
export const deleteRole = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 获取指定ID的角色
export const getRoleById = (id: number) => {
  return request<Common<Role>>({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

export type RoleMenuItem = {
  createdBy: string
  createdTime: string
  description: string
  href: string
  icon: string
  id: number
  level: number
  name: string
  operatorId: number | null
  orderNum: number
  parentId: number
  selected: false
  shown: boolean
  subMenuList: RoleMenuItem[] | null //子类型和当前父类型结构一样，所以可以直接使用父类型
  updatedBy: string
  updatedTime: string
}
// 获取角色拥有的菜单信息
export const getRoleMenus = (id: number | string) => {
  return request<Common<RoleMenuItem[]>>({
    method: 'GET',
    url: '/boss/menu/getRoleMenus',
    params: {
      roleId: id
    }
  })
}

// 给角色分配信息
export const allocateRoleMenus = (roleId: string, menuIdList: number[]) => {
  return request<Common<boolean>>({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data: {
      roleId,
      menuIdList
    }
  })
}
