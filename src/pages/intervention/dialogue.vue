<script setup lang="ts">
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import axios from 'axios'
import type { FormInstance } from 'element-plus'
dayjs.extend(isBetween)

interface Project {
  _id?: string
  created: string
  name: string
  start: string
  end: string
  active?: Boolean
  dialogue?: string
}

const current = new Date()
const drawer = ref(false)
const modalType = ref<String>()
const activeScope = ref('')

const tableData = ref<Project[]>([])
const formRef = ref<FormInstance>()
let fileData: Object

const form = reactive({
  name: '',
  date: '',
})

const getFileData = (data: Object) => {
  fileData = data
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl)
    return
  formEl.resetFields()
  drawer.value = false
}

const handleTable = async () => {
  try {
    tableData.value = []
    const resp = await axios({
      method: 'get',
      url: 'http://127.0.0.1:3000/v1/project',
    })
    const data: Array<Project> = resp.data
    for (const project of data) {
      project.active = dayjs(current).isBetween(project.start, project.end, 'day')
      tableData.value.push(project)
    }
  }
  catch (error: any) {
    ElNotification({
      title: 'Error',
      message: `${error.message}`,
      type: 'error',
      position: 'top-left',
    })
  }
}

const handleEdit = async (data: Project) => {
  try {
    const resp = await axios({
      method: 'put',
      url: `http://127.0.0.1:3000/v1/dialogue/${data.project}`,
      data: fileData,
    })
    ElNotification({
      title: 'Success',
      message: `${resp.data.message}`,
      type: 'success',
      position: 'top-left',
    })
    handleTable()
  }
  catch (error: any) {
    ElNotification({
      title: 'Error',
      message: `${error.message}`,
      type: 'error',
      position: 'top-left',
    })
  }
}

const handleDelete = async (index: number, row: Project) => {
  try {
    const resp = await axios({
      method: 'delete',
      url: `http://127.0.0.1:3000/v1/dialogue/${row._id}/${row.dialogue}`,
    })
    ElNotification({
      title: 'Success',
      message: `${resp.data.message}`,
      type: 'success',
      position: 'top-left',
    })
    handleTable()
  }
  catch (error: any) {
    ElNotification({
      title: 'Error',
      message: `${error.message}`,
      type: 'error',
      position: 'top-left',
    })
  }
}

const handleAdd = async (data: Project) => {
  try {
    console.log(data._id)

    const resp = await axios({
      method: 'post',
      url: `http://127.0.0.1:3000/v1/dialogue/${data._id}`,
      data: fileData,
    })

    console.log(resp.data)

    ElNotification({
      title: 'Success',
      message: `${resp.data.message}`,
      type: 'success',
      position: 'top-left',
    })
    handleTable()
  }
  catch (error: any) {
    ElNotification({
      title: 'Error',
      message: `${error.message}`,
      type: 'error',
      position: 'top-left',
    })
  }
}

onMounted(() => {
  handleTable()
})
</script>

<template>
  <h1 class="mb-4 text-size-xl">
    Manage dialogs
  </h1>
  <el-table :data="tableData" class="w-full">
    <el-table-column label="Name">
      <template #default="scope">
        <el-popover trigger="hover" placement="top" width="auto" title="Project">
          <template #default>
            <span>ID: {{ scope.row._id }}</span>
          </template>
          <template #reference>
            <span class="cursor-pointer">{{ scope.row.name }}</span>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="Status">
      <template #default="scope">
        <StatusTag :is-active="scope.row.active">
          <p>Start: {{ scope.row.start }}</p>
          <p>End: {{ scope.row.end }}</p>
        </StatusTag>
      </template>
    </el-table-column>
    <el-table-column label="Dialog">
      <template #default="scope">
        <p v-if="scope.row.dialogue">
          <el-popover trigger="hover" placement="top" width="auto" title="Linked dialog">
            <template #default>
              <span>ID: {{ scope.row.dialogue }}</span>
            </template>
            <template #reference>
              <div class="text-blue text-base cursor-pointer" i="carbon-link" />
            </template>
          </el-popover>
        </p>
        <div v-else class="text-base" i="carbon-unlink" />
      </template>
    </el-table-column>
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button v-if="!scope.row.dialogue" type="success" size="small" @click="drawer = true; modalType = 'Add'; activeScope = scope.$index ">
          Add dialog
        </el-button>
        <div v-else>
          <el-button size="small" @click="drawer = true; modalType = 'Edit'; activeScope = scope.$index ">
            Update
          </el-button>
          <el-popconfirm
            title="Are you sure to delete this?"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button
                size="small"
                type="danger"
              >
                Delete
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <Drawer v-model="drawer" :title="`${modalType}`">
    <template #modal>
      <div v-if="modalType === 'Add'">
        <div class="space-y-8">
          <p class="text-size-sm">
            <!-- Add a dialogue to the project <span class="underline">{{ tableData[Number(activeScope)].name }}</span>. -->
            Add a dialogue to the project.
          </p>
          <el-form
            ref="formRef"
            :model="form"
            label-position="top"
          >
            <el-form-item label="Choose a file from the disk" prop="file">
              <FileReader accept=".json" :required="true" @file-data="getFileData" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAdd(tableData[Number(activeScope)])">
                Add dialogue
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-if="modalType === 'Edit'">
        <div class="space-y-8">
          <p class="text-size-sm">
            Update a dialogue.
          </p>
          <el-form
            ref="formRef"
            :model="form"
            label-position="top"
          >
            <el-form-item label="Choose a file from the disk" prop="file">
              <FileReader accept=".json" :required="true" @file-data="getFileData" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleEdit(tableData[Number(activeScope)])">
                Update dialogue
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
