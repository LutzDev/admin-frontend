<script setup lang="ts">
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import axios from 'axios'
import type { FormInstance } from 'element-plus'
dayjs.extend(isBetween)

interface Project {
  _id?: string
  last_updated: Dayjs
  name: string
  chatbot: {
    type: string
    port?: number
    id?: string
  }
  time_span: Array<string>
  active?: Boolean
  dialog?: string
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

const handleTable = async () => {
  try {
    tableData.value = []
    const resp = await axios({
      method: 'get',
      url: 'http://127.0.0.1:3000/v1/project',
    })
    const data: Array<Project> = resp.data
    for (const project of data) {
      project.active = dayjs(current).isBetween(dayjs(project.time_span[0]), dayjs(project.time_span[1]), 'day')
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
      url: `http://127.0.0.1:3000/v1/dialog/${data.dialog}`,
      data: fileData,
    })
    drawer.value = false
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
      url: `http://127.0.0.1:3000/v1/dialog/${row._id}/${row.dialog}`,
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
    const resp = await axios({
      method: 'post',
      url: `http://127.0.0.1:3000/v1/dialog/${data._id}`,
      data: fileData,
    })
    drawer.value = false
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
        <el-popover trigger="hover" placement="top" width="auto" title="Projekt">
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
          <p>Start: {{ dayjs(scope.row.time_span[0]).format('YYYY-MM-DD') }}</p>
          <p>End: {{ dayjs(scope.row.time_span[1]).format('YYYY-MM-DD') }}</p>
        </StatusTag>
      </template>
    </el-table-column>
    <el-table-column label="Dialog">
      <template #default="scope">
        <p v-if="scope.row.dialog">
          <el-popover trigger="hover" placement="top" width="auto" title="Verbundener Dialog">
            <template #default>
              <span>ID: {{ scope.row.dialog }}</span>
            </template>
            <template #reference>
              <div class="text-blue text-base cursor-pointer" i="carbon-link" />
            </template>
          </el-popover>
        </p>
        <div v-else class="text-base" i="carbon-unlink" />
      </template>
    </el-table-column>
    <el-table-column label="Operationen">
      <template #default="scope">
        <el-button v-if="!scope.row.dialog" type="success" size="small" @click="drawer = true; modalType = 'Hinzuf??gen'; activeScope = scope.$index ">
          Dialog hinzuf??gen
        </el-button>
        <div v-else>
          <el-button size="small" @click="drawer = true; modalType = 'Bearbeiten'; activeScope = scope.$index ">
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
                L??schen
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <Drawer v-model="drawer" :title="`${modalType}`">
    <template #modal>
      <div v-if="modalType === 'Hinzuf??gen'">
        <div class="space-y-8">
          <p class="text-size-sm">
            F??gen Sie einen Dialog einem Projekt hinzu.
          </p>
          <el-form
            ref="formRef"
            :model="form"
            label-position="top"
          >
            <el-form-item label="W??hlen Sie eine Datei aus." prop="file">
              <FileReader accept=".json" :required="true" @file-data="getFileData" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAdd(tableData[Number(activeScope)])">
                Dialog hinzuf??gen
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-if="modalType === 'Bearbeiten'">
        <div class="space-y-8">
          <p class="text-size-sm">
            Hier kann der ausgew??hlte Dialog aktualisiert werden.
          </p>
          <el-form
            ref="formRef"
            :model="form"
            label-position="top"
          >
            <el-form-item label="W??hlen Sie einen Datei aus." prop="file">
              <FileReader accept=".json" :required="true" @file-data="getFileData" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleEdit(tableData[Number(activeScope)])">
                Update Dialog
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
