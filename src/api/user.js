/*
 * @Author: lmk
 * @Date: 2021-07-21 21:45:39
 * @LastEditTime: 2022-03-07 13:55:06
 * @LastEditors: lmk
 * @Description: user request
 */

import request from "@/utils/request"
/**
* @param {*} get user self info
*/
export function getUserSelfInfo(params){
  return request({
    params,
    url:'/user/me'
  })
}
/**
* @param {*} login
*/
export function signin(data){
  return request({
    data,
    url:'/signin',
    method:'post',
  })
}
/**
* @param {*} User update profile
*/
export function updateUser(data){
  return request({
    data,
    url:'/user/me',
    method:'patch',
  })
}
/**
* @param {*} get user info
*/
export function getUserInfo(uid){
  return request({
    url:`/user/${uid}`
  })
}
/**
 * @description: Join the blacklist
 * @param {Object} {uid:String}
 * @return {*}
 */
export function JoinBlackList(data){
  return request({
    data,
    url:'/user/blacklist',
    method:'post',
  })
}
/**
 * @description: remove the blacklist
 * @param {*}
 * @return {*}
 */
export function removeBlackList(uid){
  return request({
    url:`/user/blacklist/${uid}`,
    method:'delete',
  })
}
/**
 * @description: Get blacklist
 * @param {*}
 * @return {*}
 */
export function getBlackList(){
  return request({
    url:'/user/blacklist',
  })
}
/**
 * @description: share to twitter
 * @param {*} params
 * @return {*}
 */
export function shareTwitter(params){
  return request({
    params,
    url:'/share/twitter'
  })
}