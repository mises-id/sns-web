/*
 * @Author: lmk
 * @Date: 2021-07-22 13:30:37
 * @LastEditTime: 2022-08-19 18:08:13
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

export function patchHttpsUrl(){
  return request({
    url:'/mises/gasprices'
  })
}
