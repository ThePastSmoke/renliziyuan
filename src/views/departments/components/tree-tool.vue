<template>
  <el-row style="width: 100%" justify="space-between" align="middle" type="flex">
    <el-col>
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="6">
      <span>{{ treeData.manager }}</span>
      <el-dropdown style="margin-left: 20px;" @command="clickItem">
        <span class="el-dropdown-link">
          操作<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add" @click="addDept">添加部门</el-dropdown-item>
          <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
          <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
<script>
import { delDepartments } from '@/api/departments'

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
  },
  methods: {
    // 点击下拉菜单选项有一个回调函数 传回一个type通过判断type知道我们点击的是哪个
    async clickItem(type) {
      if (type === 'add') {
        this.$emit('changeIsShowAddDept', this.treeData)
      } else if (type === 'edit') {
        this.$emit('changeIsShowEditDept', this.treeData)
      } else {
        // 删除成功后提醒用户，并通知父组件重新获取列表数据
        await this.$confirm('确认删除吗？')
        await delDepartments(this.treeData.id)
        this.$message.success('删除成功')
        this.$emit('getDepartments')
      }
    },
    // 自定义事件 添加部门
    addDept() {
      this.$emit('changeIsShowAddDept', this.treeData)
    }
    //  自定义事件 编辑

  }
}
</script>
