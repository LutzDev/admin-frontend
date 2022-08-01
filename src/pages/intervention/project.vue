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

const form = reactive({
  name: '',
  date: '',
})

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

const handleEdit = async (FormInstance: FormInstance | undefined, data: Project) => {
  if (!FormInstance)
    return
  await FormInstance.validate(async (valid, fields) => {
    if (valid) {
      try {
        const resp = await axios({
          method: 'put',
          url: `http://127.0.0.1:3000/v1/project/${data._id}`,
          data: {
            name: form.name,
            start: dayjs(form.date[0]).format('YYYY-MM-DD'),
            end: dayjs(form.date[1]).format('YYYY-MM-DD'),
          },
        })
        ElNotification({
          title: 'Success',
          message: `${resp.data.message}`,
          type: 'success',
          position: 'top-left',
        })
        resetForm(FormInstance)
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
    else {
      ElNotification({
        title: 'Error',
        message: 'Fill required fields',
        type: 'error',
        position: 'top-left',
      })
    }
  })
}

const handleDelete = async (index: number, row: Project) => {
  try {
    if (!row.dialogue) {
      const resp = await axios({
        method: 'delete',
        url: `http://127.0.0.1:3000/v1/project/${row._id}`,
      })

      ElNotification({
        title: 'Success',
        message: `${resp.data.message}`,
        type: 'success',
        position: 'top-left',
      })
      handleTable()
    }
    else {
      ElNotification({
        title: 'Warning',
        message: `Before that, delete the linked dialog with the ID: ${row.dialogue}`,
        type: 'warning',
        position: 'top-left',
      })
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

const handleAdd = async (FormInstance: FormInstance | undefined) => {
  if (!FormInstance)
    return
  await FormInstance.validate(async (valid, fields) => {
    if (valid) {
      try {
        current.setDate(current.getDate())
        const projectStart = dayjs(form.date[0]).format('YYYY-MM-DD')
        const projectEnd = dayjs(form.date[1]).format('YYYY-MM-DD')
        const project: Project = {
          created: dayjs(current.setDate(current.getDate())).format('YYYY-MM-DD'),
          name: form.name,
          start: projectStart,
          end: projectEnd,
        }
        const resp = await axios({
          method: 'post',
          url: 'http://127.0.0.1:3000/v1/project',
          data: project,
        })
        ElNotification({
          title: 'Success',
          message: `${resp.data.message}`,
          type: 'success',
          position: 'top-left',
        })
        resetForm(FormInstance)
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
    else {
      ElNotification({
        title: 'Error',
        message: 'Fill required fields',
        type: 'error',
        position: 'top-left',
      })
    }
  })
}

onMounted(() => {
  handleTable()
})
</script>

<template>
  <h1 class="mb-4 text-size-xl">
    Manage projects
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
    <el-table-column label="Created">
      <template #default="scope">
        <span>{{ scope.row.created }}</span>
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
        <el-button size="small" @click="drawer = true; modalType = 'Edit'; activeScope = scope.$index ">
          Edit
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
      </template>
    </el-table-column>
  </el-table>
  <el-button class="mt-4" type="default" @click="drawer = true; modalType = 'Add'">
    Add Project
  </el-button>
  <Drawer v-model="drawer" :title="`${modalType}`">
    <template #modal>
      <div v-if="modalType === 'Add'">
        <div class="space-y-8">
          <p class="text-size-sm">
            Fügen Sie ein Projekt hinzu. Informationen, die mit einem Stern gekennzeichnet sind, sind zum Anlegen notwendig.
          </p>
          <div>
            <el-form
              ref="formRef"
              :model="form"
              label-position="top"
              class="demo-ruleForm"
            >
              <el-form-item label="Project name" prop="name" required>
                <el-input v-model="form.name" placeholder="Name of intervnetion" maxlength="20" show-word-limit clearable />
              </el-form-item>
              <el-form-item label="Choose a time frame" required prop="date">
                <el-date-picker
                  v-model="form.date"
                  type="daterange"
                  range-separator="to"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleAdd(formRef)">
                  Create
                </el-button>
                <el-button @click="resetForm(formRef)">
                  Reset
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div v-if="modalType === 'Edit'">
        <div class="space-y-8">
          <p class="text-size-sm">
            Here you can edit existing projects.
          </p>
          <el-form
            ref="formRef"
            :model="form"
            label-position="top"
            class="demo-ruleForm"
          >
            <el-form-item label="Project name" prop="name" required>
              <el-input v-model="form.name" placeholder="Name of intervnetion" maxlength="20" show-word-limit clearable />
            </el-form-item>
            <el-form-item label="Choose a time frame" required prop="date">
              <el-date-picker
                v-model="form.date"
                type="daterange"
                range-separator="to"
                start-placeholder="Start date"
                end-placeholder="End date"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleEdit(formRef, tableData[Number(activeScope)])">
                Update
              </el-button>
              <el-button @click="resetForm(formRef)">
                Reset
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
