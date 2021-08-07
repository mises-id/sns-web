/*
 * @Author: lmk
 * @Date: 2021-07-21 21:51:20
 * @LastEditTime: 2021-07-21 21:57:11
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
export function follow(uid){
  return request({
    url:`/user/${uid}/follow`,
    method:'post',
  })
}
/**
* @param {*} unfollow
*/
export function unfollow(uid){
  return request({
    url:`/user/${uid}/follow`,
    method:'delete',
  })
}