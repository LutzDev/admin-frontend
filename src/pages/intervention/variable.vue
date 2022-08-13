<script setup lang="ts">
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import axios from 'axios'
import type { FormInstance } from 'element-plus'
import { createLogger } from 'vite'
dayjs.extend(isBetween)

interface Project {
  _id: string
  created: string
  name: string
  start: string
  end: string
  active?: Boolean
  dialog?: string
}

interface Variable {
  _id?: string
  key: string
  value: string
  projects?: Array<Project>
}

const drawer = ref(false)
const modalType = ref<String>()
const activeScope = ref('')

const projectData = ref<Project[]>([])
const variableData = ref<Variable[]>([])

const formRef = ref<FormInstance>()

const form = reactive({
  key: '',
  value: '',
  project: '',
})

const options = [
  {
    label: 'Projects',
    options: [
      {
        value: '',
        label: '',
      },
    ],
  },
]

const clearInput = () => {
  form.key = ''
  form.value = ''
  form.project = ''
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl)
    return
  formEl.resetFields()
  clearInput()
}

const loadProjects = async () => {
  try {
    projectData.value = []
    options[0].options = []
    const resp = await axios({
      method: 'get',
      url: 'http://127.0.0.1:3000/v1/project',
    })
    const data: Array<Project> = resp.data
    for (const project of data) {
      options[0].options.push({
        value: project._id,
        label: project.name,
      })
      projectData.value.push(project)
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

const handleTable = async () => {
  try {
    variableData.value = []
    const resp = await axios({
      method: 'get',
      url: 'http://127.0.0.1:3000/v1/variable',
    })
    const data: Array<Variable> = resp.data
    for (const variable of data)
      variableData.value.push(variable)
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

const handleEdit = async (FormInstance: FormInstance | undefined, data: Variable) => {
  if (!FormInstance)
    return
  await FormInstance.validate(async (valid, fields) => {
    if (valid) {
      try {
        const variable: Variable = {
          key: `$${form.key}`,
          value: form.value,
        }

        const resp = await axios({
          method: 'put',
          url: `http://127.0.0.1:3000/v1/variable/${data._id}/${form.project}`,
          data: variable,
        })

        ElNotification({
          title: 'Success',
          message: `${resp.data.message}`,
          type: 'success',
          position: 'top-left',
        })
        resetForm(FormInstance)
        drawer.value = false
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

const handleDelete = async (index: number, data: Variable) => {
  try {
    const resp = await axios({
      method: 'delete',
      url: `http://127.0.0.1:3000/v1/variable/${data._id}`,
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

const handleAdd = async (FormInstance: FormInstance | undefined) => {
  if (!FormInstance)
    return
  await FormInstance.validate(async (valid, fields) => {
    if (valid) {
      try {
        const variable: Variable = {
          key: `$${form.key}`,
          value: form.value,
        }

        await axios({
          method: 'post',
          url: `http://127.0.0.1:3000/v1/variable/${form.project}`,
          data: variable,
        })
        resetForm(FormInstance)
        drawer.value = false
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
  loadProjects()
  handleTable()
})

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('You still have unsaved data, proceed?')
    .then(() => {
      resetForm(formRef.value)
      done()
    })
    .catch(() => {
      console.log('Error catched')
    })
}
</script>

<template>
  <h1 class="mb-4 text-size-xl">
    Manage variables
  </h1>
  <el-table :data="variableData" class="w-full">
    <el-table-column label="Name">
      <template #default="scope">
        <el-popover trigger="hover" placement="top" width="auto" title="Variable">
          <template #default>
            <span>ID: {{ scope.row._id }}</span>
          </template>
          <template #reference>
            <span class="cursor-pointer">{{ scope.row.key }}</span>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="Value">
      <template #default="scope">
        <span>{{ scope.row.value }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Projects">
      <template #default="scope">
        <el-tag
          v-for="(project, index) in scope.row.projects" :key="index"
          class="mx-1"
          effect="light"
          type="info"
        >
          <el-popover trigger="hover" placement="top" width="auto" title="Project">
            <template #default>
              <span>ID: {{ project._id }}</span>
            </template>
            <template #reference>
              <span class="cursor-pointer"> {{ project.name }}</span>
            </template>
          </el-popover>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" @click="drawer = true; modalType = 'Edit'; activeScope = scope.$index; form.key = variableData[Number(scope.$index)].key.replace('$', ''); form.value = variableData[Number(scope.$index)].value; form.project = JSON.parse(JSON.stringify(variableData[Number(scope.$index)].projects?.map(project => project._id)))">
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
    Add variable
  </el-button>
  <Drawer v-model="drawer" :title="`${modalType}`" :before-close="handleClose">
    <template #modal>
      <div v-if="modalType === 'Add'">
        <div class="space-y-8">
          <p class="text-size-sm">
            Fügen Sie eine Variable hinzu. Informationen, die mit einem Stern gekennzeichnet sind, sind zum Anlegen notwendig.
          </p>
          <div>
            <el-form
              ref="formRef"
              :model="form"
              label-position="top"
              class="space-y-8"
            >
              <el-form-item label="Choose variable name." prop="key" required>
                <el-input
                  v-model="form.key"
                  placeholder="variableName"
                  maxlength="20"
                  show-word-limit
                  clearable
                  :formatter="(value: any) => value.replace(/ /g, '')"
                  :parser="(value: any) => value.replace(/\$\s?|(,*)/g, '')"
                >
                  <template #prefix>
                    $
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="Choose variable value" required prop="value">
                <el-input v-model="form.value" placeholder="Value" maxlength="40" show-word-limit clearable />
              </el-form-item>
              <el-form-item label="Link to project" required prop="project">
                <el-select-v2
                  v-model="form.project"
                  filterable
                  :options="options"
                  placeholder="Please select a project"
                  class="w-100"
                  multiple
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
            Bearbeiten Sie die gewählte Variable. Informationen, die mit einem Stern gekennzeichnet sind, sind zum Anlegen notwendig.
          </p>
          <div>
            <el-form
              ref="formRef"
              :model="form"
              label-position="top"
              class="space-y-8"
            >
              <el-form-item label="Choose variable name." prop="key" required>
                <el-input
                  v-model="form.key"
                  placeholder="variableName"
                  maxlength="20"
                  show-word-limit
                  clearable
                  :formatter="(value: any) => value.replace(/ /g, '')"
                  :parser="(value: any) => value.replace(/\$\s?|(,*)/g, '')"
                >
                  <template #prefix>
                    $
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="Choose variable value" required prop="value">
                <el-input v-model="form.value" placeholder="Value" maxlength="40" show-word-limit clearable />
              </el-form-item>
              <el-form-item label="Link to project" required prop="project">
                <el-select-v2
                  v-model="form.project"
                  filterable
                  :options="options"
                  placeholder="Please select a project"
                  class="w-100"
                  multiple
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleEdit(formRef, variableData[Number(activeScope)]); drawer = false">
                  Updaten
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
