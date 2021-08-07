/*
 * @Author: lmk
 * @Date: 2021-07-21 21:51:20
 * @LastEditTime: 2021-07-21 21:57:18
 * @LastEditors: lmk
 * @Description: comment
 */

import request from "@/utils/request"

/**
* @param {*} comment list
*/
export function comment(params){
  return request({
    url:'/comment',
    params
  })
}
/**
* @param {*} create comment
*/
export function createComment(data){
  return request({
    data,
    url:'/comment',
    method:'post',
  })
}
/**f
* @param {*} remove comment
*/
export function removeComment(id){
  return request({
    url:`/comment/${id}`,
    method:'delete',
  })
}