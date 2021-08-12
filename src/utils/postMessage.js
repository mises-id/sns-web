/*
 * @Author: lmk
 * @Date: 2021-07-19 22:38:14
 * @LastEditTime: 2021-08-13 00:10:31
 * @LastEditors: lmk
 * @Description: to reactnative
 */
/**
 * @description: 
 * @param {*} 
 * @return {*}
 */
const isRn = ()=>!!window.ReactNativeWebView;
/**
 * @description: 
 * @param {*} type postmessage type
 * @param {*} data website to rn
 * @return {*}
 */
const postmessageFn = (type,data="")=>{
  return new Promise((resolve,reject)=>{
    isRn()&&window.ReactNativeWebView.postMessage(JSON.stringify({type,data}))
    window.ReactNativeWebViewCallback = res=> {
      res.success ? resolve(res) : reject(res.message)
    }
  })
}
/**
 * @description: open create misesid page
 * @param {*}
 * @return {*}
 */
export function OpenCreateUserPanel(){
  return postmessageFn('OpenCreateUserPanel')
}
/**
 * @description: open restore page
 * @param {*} 
 * @return {*}
 */
export function OpenRestoreUserPanel(){
  return postmessageFn('OpenRestoreUserPanel')
}
/**
 * @description: setUserInfo
 * @param {*} data userinfo
 * @return {*}
 */
export function setUserInfo(data){
  return postmessageFn('setUserInfo',data)
}
/**
 * @description: get authcode
 * @param {*}
 * @return {*}
 */
export function getAuth(){
  return postmessageFn('getAuth')
}

/**
 * @description:
 * @param {*} open login page
 * @return {*}
 */

export function openLoginPage(){
  return postmessageFn('openLoginPage')
}
/**
* @param {*} open new tagpage
*/
export function newTagPage(data){
  return postmessageFn('newTagPage',data)
}