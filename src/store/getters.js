import { getCompanyInfo } from '@/api/setting'

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  avatar: state => state.user.userInfo.staffPhoto,
  CompanyId: state => state.user.userInfo.companyId
}
export default getters
