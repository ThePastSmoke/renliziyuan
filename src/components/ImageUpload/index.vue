<template>
  <div>
    <el-upload
      :http-request="upload"
      :before-upload="beforeUpload"
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :file-list="fileList"
      :on-remove="handleRemove"
      :limit="1"
      :on-change="changeFile"
      :class="{disabled:fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 200px" :percentage="percentage" />
    <el-dialog title="图片预览" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDQfeNp1we6IEvMXR4QVKs99sLXS6UbR0J',
  SecretKey: '3pKYWDdmV0EBtKUO0TlnY3HFx6zcy3rP'
})

export default {
  name: 'ImageUpload',
  data() {
    return {
      showPercent: false,
      dialogImageUrl: '',
      dialogVisible: false,
      percentage: 0,
      fileList: [
        {
          url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202103%2F07%2F20210307164110_abe67.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662273661&t=fa6ce04391cea38af1cd22f88833ff39'
        }
      ]
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    upload({ file }) {
      if (!file) return
      cos.putObject({
        // 配置
        Bucket: 'renzi-1313213490', // 存储桶名称
        Region: 'ap-nanjing', // 存储桶地域
        Key: file.name, // 文件名作为key
        StorageClass: 'STANDARD', // 此类写死
        Body: file, // 将本地的文件赋值给腾讯云配置
        // 进度条
        onProgress: (params) => {
          this.percentage = params.percent * 100
        }
      }, (err, data) => {
        if (err) return this.$message.error(err?.messageg || '服务器错误')
        this.fileList.filter(item => {
          if (item.uid === file.uid) {
            item.url = `http://${data.Location}`
            item.upload = true
          }
        })
        setTimeout(() => {
          this.showPercent = false
          this.percentage = 0
        }, 1500)
      })
    },
    // 文件上传前出发的钩子函数
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('文件类型错误')
        return false
      }
      this.showPercent = true
      const size = 5 * 1024 * 1024
      if (file.size > size) {
        this.$message.error('文件太大了')
        return false
      }
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    changeFile(file, fileList) {
      this.fileList = fileList
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.disabled {
  ::v-deep.el-upload--picture-card {
    display: none;
  }
}
</style>
