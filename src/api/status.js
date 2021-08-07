/*
 * @Author: lmk
 * @Date: 2021-07-21 21:50:40
 * @LastEditTime: 2021-07-22 17:42:09
 * @LastEditors: lmk
 * @Description: status
 */

import request from "@/utils/request";

/**
* @param {*} get user status
*/
export function getStatus(params){
  return request({
    params,
    url:`/user/${params.uid}/status`
  })
}
/**
* @param {*} create Status
*/
export function createStatus(data){
  return request({
    data,
    url:'/status',
    method:'post',
  })
}
/**
* @param {*} remove Status
*/
export function removeStatus(id){
  return request({
    url:`/status/${id}`,
    method:'delete',
  })
}
/**
* @param {*} like Status
*/
export function likeStatus(id){
  return request({
    url:`/status/${id}/like`,
    method:'post',
  })
}
/**
* @param {*} get current user timeline
*/
export function getTimeline(params){
  return request({
    params,
    url:'/timeline/me'
  })
}