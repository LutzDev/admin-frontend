<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Please input',
  },
  limit: {
    type: Number,
    default: 20,
  },
})
const emit = defineEmits(['inputValue'])
const input = ref('')
const test = () => {
  console.log(input.value)
}
</script>

<template>
  <el-input v-model="input" :placeholder="`${props.placeholder}`" clearable :maxlength="`${props.limit}`" show-word-limit @change="test" @input="emit('inputValue', input)" />
</template>
