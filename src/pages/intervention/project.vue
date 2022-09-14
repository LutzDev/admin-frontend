<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
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

const form = reactive({
  name: '',
  date: '',
  chatbot: '',
  bot_id: '',
  bot_port: 0,
})

const clearInput = () => {
  form.name = ''
  form.date = ''
  form.chatbot = ''
  form.bot_id = ''
  form.bot_port = 0
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl)
    return
  formEl.resetFields()
  clearInput()
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

const handleEdit = async (FormInstance: FormInstance | undefined, data: Project) => {
  if (!FormInstance)
    return
  await FormInstance.validate(async (valid, fields) => {
    if (valid) {
      try {
        current.setDate(current.getDate())
        const project: Project = {
          last_updated: dayjs(current.setDate(current.getDate())),
          name: form.name,
          chatbot: {
            type: form.chatbot,
          },
          time_span: JSON.parse(JSON.stringify(form.date)),
        }

        if (form.chatbot === 'Botpress')
          project.chatbot.id = form.bot_id
        else
          project.chatbot.port = form.bot_port

        const resp = await axios({
          method: 'put',
          url: `http://127.0.0.1:3000/v1/project/${data._id}`,
          data: project,
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

const handleDelete = async (index: number, row: Project) => {
  try {
    if (!row.dialog) {
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
        message: `Before that, delete the linked dialog with the ID: ${row.dialog}`,
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
        const project: Project = {
          last_updated: dayjs(current.setDate(current.getDate())),
          name: form.name,
          chatbot: {
            type: form.chatbot,
          },
          time_span: JSON.parse(JSON.stringify(form.date)),
        }

        if (form.chatbot === 'Botpress')
          project.chatbot.id = form.bot_id

        else
          project.chatbot.port = form.bot_port

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
  handleTable()
})

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('You still have unsaved data, proceed?')
    .then(() => {
      resetForm(formRef.value)
      done()
    })
    .catch(() => {
    })
}
</script>

<template>
  <h1 class="mb-4 text-size-xl">
    Verwalte Projekte
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
    <el-table-column label="Zuletzt geändert">
      <template #default="scope">
        <span>{{ dayjs(scope.row.last_updated).format('YYYY-MM-DD') }}</span>
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
    <el-table-column label="Chatbot">
      <template #default="scope">
        <el-tag
          class="mx-1"
          effect="light"
          type="info"
        >
          <el-popover trigger="hover" placement="top" width="auto" title="Chatbot">
            <template #default>
              <span v-if="scope.row.chatbot.id">ID: {{ scope.row.chatbot.id }}</span>
              <span v-else>Port: {{ scope.row.chatbot.port }}</span>
            </template>
            <template #reference>
              <span class="cursor-pointer"> {{ scope.row.chatbot.type }}</span>
            </template>
          </el-popover>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Operationen">
      <template #default="scope">
        <el-button size="small" @click="drawer = true; modalType = 'Bearbeiten'; activeScope = scope.$index; form.name = tableData[Number(scope.$index)].name; form.date = JSON.parse(JSON.stringify(tableData[Number(scope.$index)].time_span)); form.chatbot = tableData[Number(scope.$index)].chatbot.type; form.bot_id = tableData[Number(scope.$index)].chatbot.id ?? ''; form.bot_port = tableData[Number(scope.$index)].chatbot.port ?? 0">
          Bearbeiten
        </el-button>
        <el-popconfirm
          title="Wollen Sie das Element wirklich löschen?"
          @confirm="handleDelete(scope.$index, scope.row)"
        >
          <template #reference>
            <el-button
              size="small"
              type="danger"
            >
              Löschen
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-button class="mt-4" type="default" @click="drawer = true; modalType = 'Hinzufügen'">
    Projekt hinzufügen
  </el-button>
  <Drawer v-model="drawer" :title="`${modalType}`" :before-close="handleClose">
    <template #modal>
      <div v-if="modalType === 'Hinzufügen'">
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
              <el-form-item label="Projektname" prop="name" required>
                <el-input v-model="form.name" placeholder="Name der Intervnetion" maxlength="20" show-word-limit clearable />
              </el-form-item>
              <el-form-item label="Wähle eine Zeitfenster" required prop="date">
                <el-date-picker
                  v-model="form.date"
                  type="daterange"
                  range-separator="bis"
                  start-placeholder="Startdatum"
                  end-placeholder="Enddatum"
                />
              </el-form-item>
              <el-form-item required label="Chatbot Framework" prop="chatbot">
                <el-radio-group v-model="form.chatbot">
                  <el-radio border label="Botpress" />
                  <el-radio border label="Rasa" />
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.chatbot === 'Botpress'" label="Botpress ID" prop="Botpress id">
                <el-input v-model="form.bot_id" placeholder="Botpress ID eingeben" />
              </el-form-item>
              <el-form-item v-if="form.chatbot === 'Rasa'" label="Rasa Port" prop="Rasa port">
                <el-input-number v-model="form.bot_port" :controls="false" required placeholder="Rasa port number" />
              </el-form-item>
              <el-form-item class="mt-8">
                <el-button type="primary" @click="handleAdd(formRef);">
                  Projekt erstellen
                </el-button>
                <el-button @click="resetForm(formRef)">
                  Zurücksetzen
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div v-if="modalType === 'Bearbeiten'">
        <div class="space-y-8">
          <p class="text-size-sm">
            Hier können bestehende Projekte bearbeiten.
          </p>
          <div>
            <el-form
              ref="formRef"
              :model="form"
              label-position="top"
              class="demo-ruleForm"
            >
              <el-form-item label="Projektname" prop="name" required>
                <el-input v-model="form.name" placeholder="Name der Intervnetion" maxlength="20" show-word-limit clearable />
              </el-form-item>
              <el-form-item label="Wähle eine Zeitfenster" required prop="date">
                <el-date-picker
                  v-model="form.date"
                  type="daterange"
                  range-separator="to"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                />
              </el-form-item>
              <el-form-item required label="Chatbot Framework" prop="chatbot">
                <el-radio-group v-model="form.chatbot">
                  <el-radio border label="Botpress" />
                  <el-radio border label="Rasa" />
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.chatbot === 'Botpress'" label="Botpress ID" prop="Botpress id">
                <el-input v-model="form.bot_id" placeholder="Botpress ID eingeben" />
              </el-form-item>
              <el-form-item v-if="form.chatbot === 'Rasa'" label="Rasa Port" prop="Rasa port">
                <el-input-number v-model="form.bot_port" :controls="false" required placeholder="Rasa port number" />
              </el-form-item>
              <el-form-item class="mt-8">
                <el-button type="primary" @click="handleEdit(formRef, tableData[Number(activeScope)]); drawer = false">
                  Updaten
                </el-button>
                <el-button @click="resetForm(formRef)">
                  Zurücksetzen
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
