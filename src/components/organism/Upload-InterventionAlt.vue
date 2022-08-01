<script setup lang="ts">
import { ref } from 'vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useInterventionStore } from '~/store/intervention'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Please input',
  },
  textLimit: {
    type: Number,
    default: 20,
  },
  action: {
    type: String,
    required: true,
  },
  uploadLimit: {
    type: Number,
    default: 1,
  },
  fileType: {
    type: String,
    default: 'json',
  },
  selectButton: {
    type: String,
    default: 'Select file',
  },
  uploadButton: {
    type: String,
    default: 'Upload file',
  },
})

const intervention = useInterventionStore()

const { counter, name } = storeToRefs(intervention)

const input = ref('')

const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const submitUpload = () => {
  upload.value!.submit()
  setTimeout(() => {
    upload.value!.clearFiles()
    input.value = ''
  }, 1000)
}

const preview: UploadProps['onPreview'] = (files) => {
  console.log('preview run')
}

const success: UploadProps['onSuccess'] = (event) => {
  ElNotification({
    message: event,
    type: 'success',
    position: 'top-left',
  })
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <p class="text-size-sm">
        Benennen Sie die Intervention

        {{ counter }}
        <button @click="intervention.addOne">
          Click me
        </button>
      </p>
      <el-input v-model="input" :placeholder="`${props.placeholder}`" clearable :maxlength="`${props.textLimit}`" show-word-limit />
    </div>
    <div class="space-y-2">
      <p class="text-size-sm">
        Wählen Sie eine Datei aus
      </p>
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="`${props.action}`"
        :limit="props.uploadLimit"
        accept=".json"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :on-preview="preview"
        :on-success="success"
      >
        <template #trigger>
          <el-button>
            {{ props.selectButton }}
          </el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip italic">
            .{{ props.fileType }}-File is required. Max file upload is {{ props.uploadLimit }}
          </div>
        </template>
      </el-upload>
    </div>
    <el-button type="success" @click="submitUpload">
      {{ props.uploadButton }}
    </el-button>
  </div>
</template>
