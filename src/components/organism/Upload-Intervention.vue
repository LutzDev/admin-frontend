<script setup lang="ts">
import axios from 'axios'
import { ElNotification } from 'element-plus'
let fileData: Object
let inputData
const getInputValue = (data: string) => {
  inputData = data
}

const getFileData = (data: Object) => {
  fileData = data
}

const upload = async () => {
  try {
    const resp = await axios({
      method: 'post',
      url: 'http://127.0.0.1:5040/transform/inky',
      data: fileData,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
    ElNotification({
      message: resp.data,
      type: 'success',
      position: 'top-left',
    })
  }
  catch (err) {
    if (err instanceof Error) {
      ElNotification({
        message: String(err.message),
        type: 'error',
        position: 'top-left',
      })
    }
  }
}

const disabled = ref(true)
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <p class="text-size-sm">
        Benennen Sie die Intervention*
      </p>
      <InputText :limit="20" placeholder="Name der Intervention" @input-value="getInputValue" />
    </div>
    <div class="space-y-2">
      <p class="text-size-sm">
        Wählen Sie die Datei aus, welche eingepflegt werden soll*
      </p>
      <FileReader accept=".json" @file-data="getFileData" />
    </div>
    <el-button v-model="uploadButton" type="success" :disabled="disabled" @click="upload">
      jetzt einpflegen
    </el-button>
  </div>
</template>
