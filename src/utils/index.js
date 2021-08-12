import { followed, liked } from "@/components/PostsIcons/common";
import { useCallback, useEffect, useState } from "react";

/*
 * @Author: lmk
 * @Date: 2021-07-15 14:16:46
 * @LastEditTime: 2021-08-12 23:28:53
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
 * @description: 
 * @param {*} funtion fn getdatalist
 * params request data
 * @return {*}
 */

export function useList(fn,params){
  let [last_id, setlast_id] = useState('');
  let [dataSource, setdataSource] = useState([]);
  const fetchData = async type=>{
    try {
      const isRefresh = type==='refresh';
      if(isRefresh){
        last_id = '';
        setlast_id(last_id);
      }
      const res = await fn({...params,last_id});
      const {last_id:lastId} = res.pagination;
      setlast_id(lastId);
      if(isRefresh){
        dataSource = []
      }
      setdataSource([...dataSource,...res.data]);
      return Promise.resolve(res)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return [fetchData,last_id,dataSource,setdataSource]
}
/**
* @param {*} 
*/
export function useRouteState(history){
  const state = history?.location?.state;
  const [historyState, sethistoryState] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getState = useCallback(() => sethistoryState(state));
  useEffect(()=>{
    getState()
  },[getState])
  return historyState;
}
/**
* @param {*} 
*/
export function useChangePosts(setdataSource,dataSource){
  const setLike = val=>{
    liked(val).then(()=>{
      const data = Array.isArray(dataSource) ? [...dataSource] : {...dataSource}
      setdataSource(data)
    });
  }
  const followPress = (val,flag)=>{
    const item = flag ? val.parent_status : val;
    followed(item).then(()=>{
      const data = Array.isArray(dataSource) ? [...dataSource] : {...dataSource}
      setdataSource(data)
    });
  }
  return {setLike,followPress}
}