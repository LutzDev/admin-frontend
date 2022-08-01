<script lang="ts" setup>
const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :router="true"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item index="/">
      <div class="mr-2" i="carbon-home" />
      <span>Home</span>
    </el-menu-item>

    <el-sub-menu index="1">
      <template #title>
        <div class="mr-2" i="carbon-chat" />
        <span>Interventions</span>
      </template>
      <el-menu-item index="/intervention/project">
        Manage project
      </el-menu-item>
      <el-menu-item index="/intervention/dialogue">
        Manage dialogue
      </el-menu-item>
      <el-menu-item index="/intervention/media">
        Upload media
      </el-menu-item>
      <el-menu-item index="/intervention/variable">
        Manage variables
      </el-menu-item>
    </el-sub-menu>

    <el-menu-item index="user" disabled>
      <div class="mr-2" i="carbon-user" />
      <span>User</span>
    </el-menu-item>

    <el-menu-item index="settings" disabled>
      <div class="mr-2" i="carbon-settings" />
      <span>Settings</span>
    </el-menu-item>
  </el-menu>
</template>
