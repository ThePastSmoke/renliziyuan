import ToolBar from '@/components/toolBar'
import UploadExcel from '@/components/UploadExcel/index'

export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar)
    Vue.component(UploadExcel.name, UploadExcel)
  }
}
