<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, ref } from 'vue'

const props = defineProps({
  header: {
    type: Array as PropType<Array<String>>,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
})

interface User {
  created: string
  name: string
  address: string
}

const search = ref('')
const filterTableData = computed(() =>
  tableData.filter(
    data =>
      !search.value
      || data.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
)
const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}

const tableData: User[] = [
  {
    created: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    created: '2016-05-02',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    created: '2016-05-04',
    name: 'Morgan',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    created: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const drawer = ref(false)
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
  <el-table :data="filterTableData" class="mb-8">
    <el-table-column v-for="(headerItem, index) in header" :key="index" :label="`${headerItem}`" :prop="`${headerItem.toLowerCase()}`" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
          Update
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- Modal -->
  <el-button @click="drawer = true">
    {{ props.buttonText }}
  </el-button>

  <el-drawer
    v-model="drawer"
    :title="`${props.buttonText}`"
    direction="rtl"
    :before-close="handleClose"
  >
    <slot name="modal" />
  </el-drawer>
</template>
