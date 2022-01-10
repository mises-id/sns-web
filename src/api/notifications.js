/*
 * @Author: lmk
 * @Date: 2022-01-04 11:05:06
 * @LastEditTime: 2022-01-07 17:01:31
 * @LastEditors: lmk
 * @Description: 
 */
import request from "@/utils/request"


/**
 * @description: get notification number
 * @param {*} 
 * @return {*}
 */
export function getNotifications(){
  return request({
    url:'/user/message/summary'
  })
}
/**
 * @description: get notification list
 * @param {*} 
 * @return {*}
 */
export function getNotificationList(params){
  return request({
    url:'/user/message',
    params
  })
}

/**
 * @description: set notification state
 * @param {*} 
 * @return {*}
 */
export function uploadNotificationState(data){
  return request({
    url:'/message/read',
    data,
    method:'put',
  })
}