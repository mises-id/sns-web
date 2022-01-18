/*
 * @Author: lmk
 * @Date: 2021-07-21 22:14:52
 * @LastEditTime: 2022-01-17 16:03:03
 * @LastEditors: lmk
 * @Description: user actions
 */
//Update login information
export function setLoginForm(data){
  return {
    type: 'SET_USER_LOGIN',
    data
  };
}
//Update user permissions
export function setUserAuth(data){
  return {
    type: 'SET_USER_AUTH',
    data
  };
}
//Update user token
export function setUserToken(data){
  return {
    type: 'SET_USER_TOKEN',
    data
  };
}
// Update user focus corner
export function setFollowingBadge(data){
  return {
    type: 'SET_FOLLOWING_BADGE',
    data
  };
}
// Set user actions
export function setUserSetting(data){
  return {
    type: 'SET_USER_SETTING',
    data
  };
}