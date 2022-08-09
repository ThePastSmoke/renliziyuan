import ToolBar from '@/components/toolBar'
import UploadExcel from '@/components/UploadExcel/index'
import ImageUpload from '@/components/ImageUpload'

export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(ImageUpload.name, ImageUpload)
  }
}
