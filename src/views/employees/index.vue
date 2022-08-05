<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!--      头部组件-->
      <ToolBar>
        <template #before>
          <span>111</span>
        </template>
        <template #after>
          <el-button size="small" type="primary" @click="$router.push('/uploadExcel')">导入</el-button>
          <el-button size="small" type="danger" @click="Export2Excel">导出</el-button>
          <el-button size="small" type="warning" @click="showDialog=true">
            新增员工
          </el-button>
        </template>
      </ToolBar>
      <!--      表格区域-->
      <el-card>
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column :formatter="formatter" label="聘用形式" sortable="" prop="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page.sync="page.page"
            :total="total"
            @current-change="getEmployeeList"
          />
        </el-row>
      </el-card>
    </div>
    <AddEmployee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
// import ToolBar from '@/components/toolBar'

import { delEmployee, getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from '@/views/employees/components/add-employee'
import { formatDate } from '@/filters'
// 表头对应关系
const headers = {
  '手机号': 'mobile',
  '姓名': 'username',
  '入职日期': 'timeOfEntry',
  '聘用形式': 'formOfEmployment',
  '转正日期': 'correctionTime',
  '工号': 'workNumber',
  '部门': 'departmentName'
}

export default {
  components: { AddEmployee },
  data() {
    return {
      showDialog: false, // 弹出层
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10
      },
      total: 0 // 总数
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 该方法负责将数组转化成二维数组
    formatJson(headers, row) {
      // rows的结构 ->
      // rows: [{username: '234234', mobile: '1398888888', 'workNumber': 123123}, ....]
      // headers的结构 ['姓名', '手机号', '入职日期', ....] -> 配置项里面生效的数据结构
      // rows的预期结果 -> result数组的每一项要和和headers一一对应
      // result -> [['张三', '138888888', '2020-10-01', ...], ['张三', '138888888', '2020-10-01', ...]]
      return row.map(item => {
        // item 为对象 ->
        // 替换成数组即可 ->
        // 数组的结构要和headers对应起来 ->

        return Object.keys(headers).map(key => {
          // key -> 中文的key
          // 预期 -> 返回当前项的值
          // 值在哪？-> item为真实的数据对象 -> 取到正确的值返回即可

          // 返回值的思路
          // 1. 数据里面的key是中文还是英文？ -> 英文
          // 2. headers里面取到中文key对应的英文key
          // 3. 直接去数据对象里面取数据
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            // 格式化日期 -> 已经定义过过滤器直接使用即可
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            // 需要引入EmployeeEnum常量进行处理
            return EmployeeEnum.hireType.find(i => i.id === item[headers[key]])?.value || '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // 导出
    async Export2Excel() {
      // 懒加载
      const { export_json_to_excel } = await import(/* webpackChunkName : "export2Excel"*/'@/utils/Export2Excel')
      // 1、获取需要导出的数据
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      // 2、调用自己封装的方法进行数据的转化
      const data = this.formatJson(headers, rows)
      export_json_to_excel({
        header: Object.keys(headers), //  // 表头数组 -> ['姓名', '手机号', '入职日期', '聘用形式', ....]
        data: data, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.total = total
      this.list = rows
    },
    formatter(row, column, cellValue) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)?.value
      return obj || '未知'
    },
    async del(id) {
      try {
        await this.$confirm('确定删除该员工？')
        await delEmployee(id)
        this.$message.success('删除成功')
        await this.getEmployeeList()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>

