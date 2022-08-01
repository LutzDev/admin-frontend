<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: 'Title',
  },
})

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>

<template>
  <el-drawer
    :title="`${props.title}`"
    direction="rtl"
    :before-close="handleClose"
  >
    <slot name="modal" />
  </el-drawer>
</template>
