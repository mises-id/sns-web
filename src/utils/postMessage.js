/*
 * @Author: lmk
 * @Date: 2021-07-19 22:38:14
 * @LastEditTime: 2021-08-16 23:49:24
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
const postmessageFn = (type,data="",loadingFlag=true)=>{
  return new Promise((resolve,reject)=>{
    isRn()&&window.ReactNativeWebView.postMessage(JSON.stringify({type,data}))
    loadingFlag&&Loading.show({
      content: <ActivityIndicator size="lg" />
    });
    if(!isRn()) {
      resolve();
      Loading.hide()
    };
    window.ReactNativeWebViewCallback = res=> {
      res.success ? resolve(res) : reject(res.message);
      loadingFlag&&Loading.hide()
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
  return postmessageFn('setUserInfo',data,false)
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
 * @description: get ListUsers
 * @param {*}
 * @return {*}
 */
 export function getListUsersCount(){
  return postmessageFn('getListUsersCount')
}

/**
 * @description:open login page
 * @param {*} 
 * @return {*} promies
 */

 export function openLoginPage(){
  return postmessageFn('openLoginPage')
}
/**
 * @description:open login page
 * @param {*} 
 * @return {*} promies
 */

export function openRegister(){
  return postmessageFn('openRegister')
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
  return postmessageFn('follow',data,false)
}
/**
* @param {*} sdk follow
*/
export function sdkUnFollow(data){
  return postmessageFn('unfollow',data,false)
}