<template>
  <el-row style="width: 100%" justify="space-between" align="middle" type="flex">
    <el-col>
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="6">
      <span>{{ treeData.manager }}</span>
      <el-dropdown style="margin-left: 20px;">
        <span class="el-dropdown-link">
          操作<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>添加部门</el-dropdown-item>
          <el-dropdown-item v-if="!isRoot">编辑部门</el-dropdown-item>
          <el-dropdown-item v-if="!isRoot">删除部门</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'TreeTool',
  props: {
    treeData: {
      type: Object,
      default: () => ({})
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  }
}
</script>
