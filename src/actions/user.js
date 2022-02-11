/*
 * @Author: lmk
 * @Date: 2021-07-21 22:14:52
 * @LastEditTime: 2022-02-08 17:23:57
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
// Set web3 actions
export function setWeb3Init(data){
  return {
    type: 'SET_WEB3_INIT',
    data
  };
}
// Set web3 actions
export function setWeb3ProviderMaxFlag(data){
  return {
    type: 'SET_WEB3_PROVIDER_FLAG',
    data
  };
}
// Set web3 actions
export function setWeb3AccountChanged(data){
  return {
    type: 'SET_WEB3_ACCOUNTCHANGED',
    data
  };
}