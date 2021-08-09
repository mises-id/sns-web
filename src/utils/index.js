import { useCallback, useState } from "react";

/*
 * @Author: lmk
 * @Date: 2021-07-15 14:16:46
 * @LastEditTime: 2021-08-09 22:51:25
 * @LastEditors: lmk
 * @Description: project util function
 */
export const pullState = {
  //pull loading state
  refresh: {
    normal: 0,
    pull: 1,
    drop: 2,
    loading: 3,
    success: 4,
    failure: 5,
  },
  load: {
    normal: 0,
    pull: 1,
    drop: 2,
    loading: 3,
    success: 4,
    failure: 5,
  }
}

/**
 * @param {*} init set text value
 */
export function useBind(init) {
  let [value, setValue] = useState(init);
  let onChange = useCallback(event => {
    setValue(event);
  }, []);
  return {
    value,
    onChange
  };
}
/**
 * @description: 
 * @param {*} url
 * @return {*}
 */
export default function urlToJson(url = window.location.href) {

  let obj = {},
    index = url.indexOf('?'),
    params = url.substr(index + 1);

  if (index !== -1) { // 有参数时
    let parr = params.split('&');
    for (let i of parr) {
      let arr = i.split('=');
      obj[arr[0]] = arr[1];
    }
  }

  return obj;
}

/**
* @param {*} 
*/
export async function getList(fn,params){
  try {
    const res = await fn(params)
    const last_id = res.pagination.next_id;
    return Promise.resolve({
      ...res,last_id
    })
  } catch (error) {
    return Promise.reject(error)
  }
}