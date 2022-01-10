/*
 * @Author: lmk
 * @Date: 2021-07-21 21:51:20
 * @LastEditTime: 2022-01-07 18:22:33
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
/**
* @param {string} id
*/
export function likeComment(id){
  return request({
    url:`/comment/${id}/like`,
    method:'post',
  })
}
/**
* @param {*} 
*/
export function unlikeComment(id){
  return request({
    url:`/comment/${id}/like`,
    method:'delete'
  })
}