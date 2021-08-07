/*
 * @Author: lmk
 * @Date: 2021-07-21 21:45:39
 * @LastEditTime: 2021-07-21 22:20:49
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