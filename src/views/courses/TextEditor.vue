<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { watchEffect } from 'vue'
import { watch } from 'vue'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// // 模拟 ajax 异步获取内容
// onMounted(() => {
//   setTimeout(() => {
//     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
//   }, 1500)
// })

// 声明属性
const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})
// 当属性变化是，自动赋值
watchEffect(() => {
  valueHtml.value = props.content
})
// 当valuHrml变化时，自动告诉父组件
watch(valueHtml, (newvalue) => {
  emits('update:content', newvalue)
})

// 声明时间消息
const emits = defineEmits<{ (e: 'update:content', value: string): void }>()
const toolbarConfig = {} //工具栏的配置信息
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      fieldName: 'file',
      server: '/boss/course/upload',
      customInsert(res: any, insertFn: any) {
        if (res.data.code === '000000') {
          insertFn(res.data.name)
        } else {
          ElMessage.error('富文本编辑器图片上传失败！')
          throw new Error('富文本编辑器图片上传失败！')
        }
      }
    }
  }
} //输入工具的配置信息

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: string) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
</script>

<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
    />
  </div>
</template>

<style scoped lang="scss"></style>
