<script setup lang="ts">
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

interface Project {
  date: string
  name: string
  start: string
  end: string
  active: Boolean
}

const now = new Date()
let projectStart: string
let projectEnd: string
const drawer = ref(false)
const modalType = ref<String>()
const inputName = ref('')
const inputDate = ref('')
const activeScope = ref('')

const tableData = ref<Project[]>([
  {
    date: '2016-07-25',
    name: 'eLan',
    start: '2022-07-20',
    end: '2022-08-11',
    active: true,
  },
])

const handleEdit = (index: number, row: Project) => {
  console.log(index, row)
  drawer.value = true
}
const handleDelete = (index: number, row: Project) => {
  console.log(index, row)
  tableData.value.splice(index, 1)
}

const handleClear = () => {
  inputName.value = ''
  inputDate.value = ''
}

const handleView = () => {
  // TODO: REST
}

const handleAdd = () => {
  now.setDate(now.getDate())
  projectStart = dayjs(inputDate.value[0]).format('YYYY-MM-DD')
  projectEnd = dayjs(inputDate.value[1]).format('YYYY-MM-DD')
  const project: Project = {
    date: dayjs(now.setDate(now.getDate())).format('YYYY-MM-DD'),
    name: inputName.value,
    start: projectStart,
    end: projectEnd,
    active: dayjs(now).isBetween(projectStart, projectEnd, 'day'),
  }
  tableData.value.push(project)
  drawer.value = false
  handleClear()

  // TODO: REST
}
</script>

<template>
  <h1 class="mb-4 text-size-xl">
    Manage media
  </h1>
  <el-table :data="tableData" class="w-full">
    <el-table-column label="Name">
      <template #default="scope">
        <span>{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Created">
      <template #default="scope">
        <span>{{ scope.row.date }}</span>
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
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row); drawer = true; modalType = 'Upload'; activeScope = scope.$index ">
          Upload
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <Drawer v-model="drawer" :title="`${modalType}`">
    <template #modal>
      <div v-if="modalType === 'Upload'">
        <div class="space-y-8">
          <p class="text-size-sm">
            Here you can upload a dialog file (.json).
          </p>
          <div class="space-y-2">
            <p class="text-size-sm">
              Upload a file
            </p>
            <FileReader />
          </div>
          <el-button type="success" @click="handleAdd">
            Update Project
          </el-button>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
