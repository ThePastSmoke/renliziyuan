<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :visible="isShowAddDept" :title="showTitle" @close="close">
    <el-form ref="deptForm" :rules="rules" :model="formData" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model.trim="formData.name" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>

import { addDepartments, getDepartDetail, getDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  name: 'AddDept',
  props: {
    isShowAddDept: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkName = async(rule, value) => {
      // 1、 接口获取所有的部门
      const { depts } = await getDepartments()
      // 2、找到当前点击的部门的所有子部门
      let currentNodeChilren
      if (this.formData.id) {
        //  编辑
        currentNodeChilren = depts.filter(item => {
          return item.pid === this.currentNode.pid && item.id !== this.currentNode.id
        })
      } else {
        //  添加
        currentNodeChilren = depts.filter(item => item.pid === this.currentNode.id)
      }

      // 3、判断当前部门的所有子部门名称是否包含用户输入的部门名称
      const isRepeat = currentNodeChilren.some(item => item.name === value)
      // 4、如果包含说明名称重复
      if (isRepeat) {
        return Promise.reject('部门名称重复')
      }
    }
    const checkCode = async(rules, value) => {
      // 1、 接口获取所有的部门
      const { depts } = await getDepartments()
      //  2、直接判断当前用户添写的code是否包含在已存在的数据里面

      let isRepeat
      if (this.formData.id) {
        //  编辑
        isRepeat = depts.some(item => (item.code === value && item.id !== this.currentNode.id))
      } else {
        isRepeat = depts.some(item => (item.code === value))
      }
      if (isRepeat) {
        return Promise.reject('部门code重复')
      }
      // --> 核心逻辑：用户输入的部门code跟任何部门的code都不能重复
    }
    return {
      peoples: [], // 下拉框
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkName, message: '部门名称不能重复', trigger: 'blur' }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkCode, message: '部门id不能重复', trigger: 'blur' }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '添加部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    //  添加表单
    async btnOK() {
      try {
        await this.$refs.deptForm.validate()
        if (this.formData.id) {
          //  编辑
          await updateDepartments(this.formData)
        } else {
          //  添加
          await addDepartments({ ...this.formData, pid: this.currentNode.id })
        }
        this.$message.success(`${this.showTitle}成功`)
        // 重新拉去数据
        this.$emit('getDepartments')
        this.close()
      } catch (e) {
        console.log(e)
      }
    },
    close() {
      //  重置表单
      this.$refs.deptForm.resetFields()
      // 强中重置表单
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$emit('update:isShowAddDept', false)
    },
    // 获取部门详情  add-dept.vue组件内部
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }

  }
}
</script>
