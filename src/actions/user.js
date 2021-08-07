/*
 * @Author: lmk
 * @Date: 2021-07-21 22:14:52
 * @LastEditTime: 2021-08-05 22:53:20
 * @LastEditors: lmk
 * @Description: user actions
 */
//更新登录信息
export function setLoginForm(data){
  return {
    type: 'SET_USER_LOGIN',
    data
  };
}
//更新用户权限
export function setUserAuth(data){
  return {
    type: 'SET_USER_AUTH',
    data
  };
}
//更新用户token
export function setUserToken(data){
  return {
    type: 'SET_USER_TOKEN',
    data
  };
}