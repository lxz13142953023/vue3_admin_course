<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
// import type { UploadProgressEvent } from 'element-plus'
import { ElMessage } from 'element-plus'
import { watchEffect } from 'vue'

// 声明属性
const props = defineProps({
  modelValue: {
    type: String,
    default: undefined
  }
})

// 声明事件消息
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 保存图片内存中的临时地址
const imageUrl = ref('')
watchEffect(() => {
  imageUrl.value = props.modelValue
})

// 回调：图片上传成功后
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  emits('update:modelValue', response.data.name)
}

// 回调：图片上传之前-检查
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

// 上传进度值
const percentage = ref(0)

// // 上传组件的进度改变回调函数
// const handleProgress = (evt: UploadProgressEvent) => {
//   percentage.value = Math.floor(evt.percent)
// }

// 是否显示进度条
const isShowProgress = ref(false)
</script>

<template>
  <div>
    <el-progress v-show="isShowProgress" type="circle" :percentage="percentage" :width="178" />
    <el-upload
      v-show="!isShowProgress"
      class="avatar-uploader"
      action="/boss/course/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" @load="isShowProgress = false" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
