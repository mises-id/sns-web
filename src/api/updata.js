/*
 * @Author: lmk
 * @Date: 2021-07-22 13:30:37
 * @LastEditTime: 2021-12-31 17:52:22
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
    url:'/upload',
    method:'post',
    headers:{
      'Content-Type' : 'multipart/form-data',
    }
  })
}