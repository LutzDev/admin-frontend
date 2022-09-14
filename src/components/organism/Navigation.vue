<script lang="ts" setup>
const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
}
const handleClose = (key: string, keyPath: string[]) => {

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
      <span>Startseiten</span>
    </el-menu-item>

    <el-sub-menu index="1">
      <template #title>
        <div class="mr-2" i="carbon-chat" />
        <span>Interventionen</span>
      </template>
      <el-menu-item index="/intervention/project">
        Projekte verwalten
      </el-menu-item>
      <el-menu-item index="/intervention/dialog">
        Dialoge verwalten
      </el-menu-item>
      <el-menu-item index="/intervention/variable">
        Variablen verwalten
      </el-menu-item>
    </el-sub-menu>

    <el-menu-item index="user" disabled>
      <div class="mr-2" i="carbon-user" />
      <span>Nutzer</span>
    </el-menu-item>

    <el-menu-item index="settings" disabled>
      <div class="mr-2" i="carbon-settings" />
      <span>Einstelungen</span>
    </el-menu-item>
  </el-menu>
</template>
