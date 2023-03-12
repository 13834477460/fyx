import request from '@/utils/request'

// info    GET   /admin/acl/index/info    获取个人信息
// login   POST  /admin/acl/index/login   获取token
// logout  POST  /admin/acl/index/logout  退出登陆,token失效


export interface UserInfoModel {
  avatar: string,
  buttons: string[],
  name: string,
  roles: string[],
  routes: string[]
}

export interface loginModel {
  username: string,
  password: string
}

export interface TokenModel {
  token: string
}

export default {
  login(loginData: loginModel) {
    return request.post<any, TokenModel>(`/admin/acl/index/login`, loginData)
  },
  getInfo() {
    return request.get<any, UserInfoModel>(`/admin/acl/index/info`)
  },
  logout() {
    return request.post<any, null>(`/admin/acl/index/logout`)
  }
}
