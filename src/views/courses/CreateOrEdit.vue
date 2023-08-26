<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import ImageUpload from './ImageUpload.vue'
import TextEditor from './../courses/TextEditor.vue'
import { saveOrUpdateCourse, getCourseById } from './../../api/courses'
import { onMounted } from 'vue'

const router = useRouter()

const props = defineProps({
  courseId: {
    type: String,
    default: ''
  }
})

// 步骤条当前位置
const currentStep = ref(0)
// 表单数据-课程信息
const course = ref({
  // 课程的基本信息
  courseName: '',
  brief: '',
  teacherDTO: {
    teacherName: '',
    position: '',
    description: ''
  },
  previewFirstField: '',
  previewSecondField: '',
  sortNum: 0,
  // 课程图片
  courseListImg: '',
  courseImgUrl: '',
  // 销售信息
  discounts: 0,
  price: 0,
  sales: 0,
  discountsTag: '',
  // 秒杀活动
  activityCourse: true,
  activityCourseDTO: {
    beginTime: '',
    endTime: '',
    amount: 0,
    stock: 0
  },
  // 课程详情
  courseDescriptionMarkDown: '',
  status: 1
})

// 秒杀活动的时间范围
const timeRange = ref([] as any)

// 监听时间范围变化，存储到course
watch(timeRange, (newvalue) => {
  if (Array.isArray(newvalue)) {
    course.value.activityCourseDTO.beginTime = newvalue[0].toISOString()
    course.value.activityCourseDTO.endTime = newvalue[1].toISOString()
  } else {
    course.value.activityCourseDTO.beginTime = ''
    course.value.activityCourseDTO.endTime = ''
  }
})
// 表单提交事件
const onSubmit = async () => {
  const info = props.courseId ? '更新课程' : '创建课程'
  const { data } = await saveOrUpdateCourse(course.value)
  if (data.code === '000000') {
    ElMessage.success(`${info}成功！`)
    router.push({ name: 'courses' })
  } else {
    ElMessage.error(`${info}失败！`)
    throw new Error(`${info}失败！`)
  }
}

onMounted(async () => {
  if (props.courseId) {
    const { data } = await getCourseById(props.courseId)
    if (data.code === '000000') {
      course.value = data.data
      if (data.data.activityCourseDTO) {
        timeRange.value = [
          new Date(data.data.activityCourseDTO.beginTime),
          new Date(data.data.activityCourseDTO.endTime)
        ]
      }
    }
  }
})

// 秒杀活动状态切换
const activityChange = (newValue) => {
  if (newValue && course.value.activityCourseDTO === null) {
    course.value.activityCourseDTO = {
      beginTime: '',
      endTime: '',
      amount: 0,
      stock: 0
    }
  }
}
</script>

<template>
  <div>
    <el-page-header @back="router.go(-1)">
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3"> {{ props.courseId ? '编辑' : '创建' }}课程 </span>
        </div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button type="primary" class="ml-2" @click="onSubmit">保存</el-button>
        </div>
      </template>
    </el-page-header>
    <el-card class="box-card">
      <template #header>
        <el-steps :space="200" :active="currentStep" simple>
          <el-step title="基本信息" icon="Edit" @click="currentStep = 0" />
          <el-step title="课程封面" icon="Picture" @click="currentStep = 1" />
          <el-step title="销售信息" icon="Tools" @click="currentStep = 2" />
          <el-step title="秒杀活动" icon="Clock" @click="currentStep = 3" />
          <el-step title="课程详情" icon="Document" @click="currentStep = 4" />
        </el-steps>
      </template>
      <el-form :model="course" label-width="120px" size="large">
        <!-- 基本信息 -->
        <div v-show="currentStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="职位">
            <el-input v-model="course.teacherDTO.position"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              v-model="course.previewFirstField"
              style="flex: 1; margin-right: 10px"
            ></el-input>
            <el-input v-model="course.previewSecondField" style="flex: 1"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number v-model="course.sortNum" controls-position="right"></el-input-number>
          </el-form-item>
        </div>
        <!-- 课程封面 -->
        <div v-show="currentStep === 1">
          <el-form-item label="展示图片">
            <ImageUpload v-model="course.courseListImg"></ImageUpload>
          </el-form-item>
          <el-form-item label="解锁图片">
            <ImageUpload v-model="course.courseImgUrl"></ImageUpload>
          </el-form-item>
        </div>
        <div v-show="currentStep === 2">
          <el-form-item label="售卖价格">
            <el-input-number v-model="course.discounts" controls-position="right"></el-input-number>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input-number v-model="course.price" controls-position="right"></el-input-number>
          </el-form-item>
          <el-form-item label="销量">
            <el-input-number v-model="course.sales" controls-position="right"></el-input-number>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag"></el-input>
          </el-form-item>
        </div>
        <div v-show="currentStep === 3">
          <el-form-item label="限时秒杀">
            <el-switch
              @change="activityChange"
              v-model="course.activityCourse"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              :active-value="true"
              :inactive-value="false"
            />
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="活动时间" style="width: 800px">
              <el-date-picker
                v-model="timeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束事件"
              />
            </el-form-item>
            <el-form-item label="活动价格">
              <el-input-number
                :min="0"
                v-model="course.activityCourseDTO.amount"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="库存值">
              <el-input-number
                :min="0"
                v-model="course.activityCourseDTO.stock"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </template>
        </div>
        <div v-show="currentStep === 4">
          <el-form-item label="课程详情">
            <TextEditor v-model:content="course.courseDescriptionMarkDown"></TextEditor>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
              v-model="course.status"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </div>
        <div class="form-bottom-btn">
          <el-button v-show="currentStep != 0" @click="currentStep--">上一步</el-button>
          <el-button v-show="currentStep != 4" @click="currentStep++">下一步</el-button>
          <el-button v-show="currentStep == 4" type="primary" @click="onSubmit">保存</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: auto;
  margin-top: 17px;
}
.el-step {
  cursor: pointer;
}
.form-bottom-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-form {
  padding: 0px 160px 0px 0px;
}
</style>
