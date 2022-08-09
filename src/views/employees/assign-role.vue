<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="close">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleId">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="4">
        <el-button type="primary" size="small" @click="butOK">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      defaults: false
    }
  },
  data() {
    return {
      roleId: [],
      list: [],
      userId: null
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async butOK() {
      try {
        await assignRoles({
          id: this.userId,
          roleIds: this.roleId
        })
        this.$message.success('修改角色成功')
        this.close()
      } catch (e) {
        this.$message.error('修改角色失败')
        this.close()
      }
    },
    close() {
      this.$emit('update:showRoleDialog', false)
    },
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    async getUserDetailById(id) {
      this.userId = id
      const { roleIds } = await getUserDetailById(id)
      this.roleId = roleIds // 赋值本用户的角色
    }
  }
}
</script>
<style></style>
