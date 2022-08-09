<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #after>
          <el-button type="primary" size="mini" @click="addPermission('0',1)">添加权限</el-button>
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table :data="list" border row-key="id">
        <el-table-column type="index" label="序号" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(row.id,2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermissionsList(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  弹框-->
    <el-dialog :title="`${showText}权限`" :visible="showDialog" @close="close">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <!--          /* 当值为1(active-value)时，激活节点，当值为(inactive-value)0时，不激活 */-->
          <!--          /* v-model绑定的为当前switch对应的值 */-->
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="close">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import ToolBar from '@/components/toolBar'
import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'Permission',
  components: { ToolBar },
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 编辑
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    async delPermissionsList(id) {
      try {
        await this.$confirm('确定删除？')
        await delPermission(id)
        this.$message.success('删除成功')
        await this.getPermissionList()
      } catch (e) {
        console.log(e)
      }
    },
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async getPermissionList() {
      const res = await getPermissionList()
      this.list = tranListToTreeData(res, '0')
    },
    async btnOK() {
      try {
        await this.$refs.perForm.validate()
        if (this.formData.id) {
          //  编辑
          await updatePermission(this.formData)
        } else {
          // 新增
          await addPermission(this.formData)
        }
        this.$message.success(`${this.showText}权限成功`)
        await this.getPermissionList()
        this.close()
      } catch (e) {
        console.log(e)
        this.close()
        this.$message.error('添加权限失败')
      }
    },
    btnCancel() {
    },
    close() {
      this.showDialog = false
      this.$refs.perForm.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">

</style>

