/*
 * @Author: lmk
 * @Date: 2021-07-21 21:50:40
 * @LastEditTime: 2021-08-10 18:08:39
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
* @param {*} remove Status
*/
export function getStatusItem(id){
  return request({
    url:`/status/${id}`
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
* @param {*} unlike Status
*/
export function unLikeStatus(id){
  return request({
    url:`/status/${id}/like`,
    method:'delete',
  })
}
/**
* @param {*} get current user following
*/
export function following(params){
  return request({
    params,
    url:'/timeline/me'
  })
}
/**
* @param {*} discover data
*/
export function recommend(params){
  return request({
    params,
    url:'/status/recommend'
  })
}
/**
* @param {*} my posts
*/
export function myPostsData(params){
  return request({
    params,
    url:`/user/${params.uid}/status`
  })
}
/**
* @param {*} 
*/
export function deletePosts(id){
  return request({
    url:`/status/${id}`,
    method:'DELETE'
  })
}

/**
* @param {*} 
*/
export function getComment(params){
  return request({
    url:`/comment`,
    params
  })
}
