/*
 * @Author: lmk
 * @Date: 2021-07-19 22:38:14
 * @LastEditTime: 2021-08-13 01:04:24
 * @LastEditors: lmk
 * @Description: to reactnative
 */

import { ActivityIndicator, Loading } from "zarm";

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
    Loading.show({
      content: <ActivityIndicator size="lg" />
    });
    window.ReactNativeWebViewCallback = res=> {
      res.success ? resolve(res) : reject(res.message);
      Loading.hide()
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
/**
* @param {*} sdk follow
*/
export function sdkFollow(data){
  return postmessageFn('follow',data)
}
/**
* @param {*} sdk follow
*/
export function sdkUnFollow(data){
  return postmessageFn('unfollow',data)
}