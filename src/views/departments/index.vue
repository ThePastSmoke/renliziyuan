<template>
  <div v-loading="isLoading" class="dashboard-container">
    <div class="app-container">
      <!--  上方卡面试图-->
      <el-card class="box-card-title">
        <tree-tool :is-root="true" :tree-data="company" @changeIsShowAddDept="changeIsShowAddDept" />
      </el-card>
      <!-- 树形结构-->
      <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
        <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
        <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
        <template v-slot="{data}">
          <tree-tool
            :is-root="false"
            :tree-data="data"
            @changeIsShowAddDept="changeIsShowAddDept"
            @getDepartments="getDepartments"
            @changeIsShowEditDept="changeIsShowEditDept"
          />
        </template>
      </el-tree>
    </div>
    <!--    新增弹框-->
    <AddDept
      ref="addDept"
      :current-node="currentNode"
      :is-show-add-dept.sync="isShowAddDept"
      @getDepartments="getDepartments"
    />
  </div>
</template>

<script>
import TreeTool from '@/views/departments/components/tree-tool'
import AddDept from './components/add-dept'
import { getDepartments } from '@/api/departments'
import { tranListToTreeDataNew } from '@/utils'

export default {
  components: { TreeTool, AddDept },
  data() {
    return {
      isLoading: false, // 加载进度条
      currentNode: {},
      isShowAddDept: false, // 添加部门弹层字段
      defaultProps: {
        label: 'name'
      },
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    changeIsShowAddDept(node) {
      this.isShowAddDept = true
      // 记录下当前节点
      this.currentNode = node
    },
    // 点击编辑
    changeIsShowEditDept(node) {
      this.isShowAddDept = true
      this.currentNode = node
      this.$refs.addDept.getDepartDetail(node.id)
    },
    // 获取列表
    async getDepartments() {
      try {
        this.isLoading = true
        const res = await getDepartments()
        this.company.name = res.companyName
        this.company.manager = res.compantManagge || '管理员'
        this.company.id = ''
        this.departs = tranListToTreeDataNew(res.depts)
        this.isLoading = false
      } catch (e) {
        console.log(e)
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard-container {
  width: 900px;
  //border: 1px solid #ccc;
  margin: 20px auto;

  .box-card-title {
    background: #99ccff;
  }

}
</style>

