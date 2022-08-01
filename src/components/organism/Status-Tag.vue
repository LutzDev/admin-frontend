<script setup lang="ts">
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div>
    <el-popover v-if="props.isActive" trigger="hover" placement="top" width="auto" title="Status">
      <template #default>
        <slot />
      </template>
      <template #reference>
        <el-tag type="success" class="cursor-pointer">
          Active
        </el-tag>
      </template>
    </el-popover>
    <el-popover v-if="!props.isActive" trigger="hover" placement="top" width="auto" title="Status">
      <template #default>
        <slot />
      </template>
      <template #reference>
        <el-tag type="warning" class="cursor-pointer">
          Inactive
        </el-tag>
      </template>
    </el-popover>
  </div>
</template>
