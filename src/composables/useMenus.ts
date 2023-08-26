import { ref, computed } from 'vue'
import { getAll, saveOrUodate, deleteMenu, getEditMenuInfo } from './../api/menus'
import type { MenuItem } from './../api/menus'
import { ElMessage } from 'element-plus'
import type { CreateOrEditMenu } from './../api/menus'
import router from '@/router/index'

export function useMenus() {
  //这里不使用export单独导出是防止多地方调用时数据出现混乱干扰
  const allMenus = ref([] as MenuItem[])
  const getAllMenus = async () => {
    const { data } = await getAll()
    if (data.code === '000000') {
      allMenus.value = data.data
    } else {
      ElMessage.error('获取所有菜单失败')
      throw new Error('获取所有菜单失败')
    }
  }
  const topMenus = computed(() => {
    //通过使用计算属性防止出现数组为空的情况
    return allMenus.value.filter((menu) => menu.level === 0)
  })

  // 表单的响应数据
  const form = ref<CreateOrEditMenu>({
    name: '',
    href: '',
    parentId: -1,
    description: '',
    icon: '',
    shown: true,
    orderNum: 0
  })

  // 状态与提示文字: true:添加状态/false:编辑状态
  const isCreate = ref(true)
  const msgText = computed(() => {
    return isCreate.value ? '添加' : '更新'
  })

  // 表单提交事件
  const onSubmit = async () => {
    const { data } = await saveOrUodate(form.value)
    if (data.code === '000000') {
      ElMessage.success(`${msgText.value}菜单成功！`)
      router.push({ name: 'menus' })
    } else {
      ElMessage.error(`${msgText.value}菜单失败！`)
      throw new Error(`${msgText.value}菜单失败！`)
    }
  }

  // 删除菜单的事件处理函数
  const handleDelete = async (id: string) => {
    await ElMessageBox.confirm('确认要删除该菜单吗？', '删除提醒', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).catch(() => {
      ElMessage.info('删除操作被取消！')
      return new Promise(() => {})
    })

    // 调用接口函数
    const { data } = await deleteMenu(id)
    if (data.code === '000000') {
      ElMessage.success(`${msgText.value}菜单成功！`)
      getAllMenus()
    } else {
      ElMessage.error(`${msgText.value}菜单失败！`)
      throw new Error(`${msgText.value}菜单失败！`)
    }
  }
  // 根据id获取菜单信息
  const getMenuInfoById = async (id: string) => {
    // 根据id是否存在,判断是添加还是更新
    if (!id) {
      isCreate.value = true
      return
    } else {
      isCreate.value = false
    }
    const { data } = await getEditMenuInfo(id)
    if (data.code === '000000') {
      form.value = data.data.menuInfo
    } else {
      ElMessage.error('获取编辑菜单信息失败！')
      throw new Error('获取菜单信息失败！')
    }
  }
  return { allMenus, getAllMenus, topMenus, form, onSubmit, handleDelete, getMenuInfoById, msgText }
}
