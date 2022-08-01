<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    require: true,
  },
})
</script>

<template>
  <a href="/">
    <el-image :src="props.src" class="h-12">
      <template #placeholder>
        <div class="image-slot">
          Loading<span class="dot">...</span>
        </div>
      </template>
    </el-image>
  </a>
</template>
