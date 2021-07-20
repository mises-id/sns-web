/*
 * @Author: lmk
 * @Date: 2021-07-19 22:38:14
 * @LastEditTime: 2021-07-20 09:54:08
 * @LastEditors: lmk
 * @Description: to reactnative
 */
/**
 * @description: 
 * @param {*} 
 * @return {*}
 */
export function OpenCreateUserPanel(){
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type:'OpenCreateUserPanel'
  }))
}
/**
 * @description: 
 * @param {*} 
 * @return {*}
 */
export function OpenRestoreUserPanel(){
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type:'OpenRestoreUserPanel'
  }))
}