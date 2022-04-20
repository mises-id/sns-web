/*
 * @Author: lmk
 * @Date: 2021-07-21 21:50:40
 * @LastEditTime: 2022-02-08 15:01:15
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
* @param {*} get recent
*/
export function recent(params){
  return request({
    params,
    url:'/status/recent'
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
* @param {*} my likes
*/
export function likesData(params){
  return request({
    params,
    url:`/user/${params.uid}/like`
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
/**
* @param {*} discover data
*/
export function recommendUser(){
  return request({
    url:'/user/recommend'
  })
}
/**
* @param {*} discover data
*/
export function followingLatest(){
  return request({
    url:'/user/following/latest'
  })
}
/**
* @param {*} discover data
*/
export function refreshStatus(ids){
  return request({
    url:'/status/list',
    method:'post',
    data:{ids}
  })
}