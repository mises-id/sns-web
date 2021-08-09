/*
 * @Author: lmk
 * @Date: 2021-07-21 21:51:20
 * @LastEditTime: 2021-08-09 21:51:18
 * @LastEditors: lmk
 * @Description: fans
 */

import request from "@/utils/request"

/**
* @param {*} list follower
*/
export function friendShip(params){
  return request({
    params,
    url:`/user/${params.uid}/friendship`,
  })
}
/**
* @param {*} follow user
*/
export function follow(data){
  return request({
    url:`/user/follow`,
    method:'post',
    data
  })
}
/**
* @param {*} unfollow
*/
export function unfollow(data){
  return request({
    url:`/user/follow`,
    method:'delete',
    data
  })
}