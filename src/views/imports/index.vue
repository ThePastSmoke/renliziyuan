<template>
  <!-- 公共导入组件 -->
  <UploadExcel :on-success="success" />
</template>
<script>

import { importEmployee } from '@/api/employees'

const userRelations = {
  '入职日期': 'timeOfEntry',
  '手机号': 'mobile',
  '姓名': 'username',
  '转正日期': 'correctionTime',
  '工号': 'workNumber'
}

export default {
  name: 'Imports',
  methods: {
    async success({ results }) {
      // console.log(results)
      const resArr = results.map(item => {
        const obj = {}
        for (const itemKet in item) {
          if (['timeOfEntry', 'correctionTime'].includes(userRelations[itemKet])) {
            obj[userRelations[itemKet]] = new Date(this.formatDate(item[itemKet], '/'))
          } else {
            obj[userRelations[itemKet]] = item[itemKet]
          }
        }
        return obj
      })
      console.log(resArr)
      await importEmployee(resArr)
      this.$message.success('成功')
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
