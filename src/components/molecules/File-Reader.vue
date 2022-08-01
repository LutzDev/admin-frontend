<script setup lang="ts">
const props = defineProps({
  accept: {
    type: String,
    default: '*',
  },
  required: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['fileData'])
let json = ref<string>()
const changed = (e) => {
  const file: File = e.target.files[0]
  const reader: FileReader = new FileReader()
  reader.onloadend = (e) => {
    if (reader.result) {
      json = JSON.parse(reader.result.toString())
      emit('fileData', json)
    }
  }
  reader.readAsText(file)
}
const inputFile = ref(null)

const checkSelection = () => {
  console.log(inputFile.value.files.length)
}
</script>

<template>
  <div>
    <input ref="inputFile" :required="required" type="file" :accept="`${props.accept}`" @change="changed" @mouseenter="checkSelection">
  </div>
</template>
