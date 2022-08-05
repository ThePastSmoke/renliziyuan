<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog=true"
              >新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border :data="list">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="currentChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form ref="roleRef" disabled label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑弹层 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="close">
      <el-form ref="roleRef" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="close">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, deleteRole, getCompanyInfo, getRoleDetail, getRoleList, updateRole } from '@/api/setting'

export default {
  name: 'Setting',
  data() {
    return {
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      total: 0,
      page: {
        page: 1,
        pagesize: 10
      },
      list: [],
      formData: {}
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    //  获取角色列表
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.total = total
      this.list = rows
    },
    currentChange(page) {
      this.page.page = page
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.CompanyId)
    },
    async del(id) {
      try {
        await this.$confirm('确定删除嘛')
        const len = this.list.length
        await deleteRole(id)
        this.$message.success('删除成功')
        if (len === 1 && this.page.page > 1) {
          this.page.page--
        }
        await this.getRoleList()
      } catch (e) {
        console.log(e)
      }
    },
    //  编辑
    async edit(id) {
      this.showDialog = true
      this.roleForm = await getRoleDetail(id)
    },
    // 关闭
    close() {
      this.showDialog = false
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    async btnOK() {
      try {
        await this.$refs.roleRef.validate()
        if (this.roleForm.id) {
          //  编辑
          await updateRole(this.roleForm)
        } else {
          await addRole(this.roleForm)
        }
        this.$message.success(('成功'))
        await this.getRoleList()
        this.close()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>

