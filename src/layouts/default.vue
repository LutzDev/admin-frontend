<template>
  <div class="text-gray-700 dark:text-gray-200">
    <div class="common-layout">
      <el-container>
        <el-header height="auto">
          <div class="p-y-4">
            <Logo src="/assets/images/logo/IMTT-Logo-HFU_small.png" />
          </div>
        </el-header>
        <el-container>
          <el-aside>
            <Navigation />
          </el-aside>
          <el-main>
            <RouterView />
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
