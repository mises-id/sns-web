/*
 * @Author: lmk
 * @Date: 2021-07-22 13:30:37
 * @LastEditTime: 2021-07-22 14:02:02
 * @LastEditors: lmk
 * @Description: file updata
 */

import request from "@/utils/request";

/**
* @param {*} updata file
*/
export function attachment(data){
  return request({
    data,
    url:'/attachment',
    method:'post',
    headers:{
      'Content-Type' : 'multipart/form-data',
    }
  })
}