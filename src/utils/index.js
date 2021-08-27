import { followed, liked } from "@/components/PostsIcons/common";
import { useCallback, useEffect, useState } from "react";
import { getListUsersCount, OpenCreateUserPanel, openLoginPage } from "@/utils/postMessage";
import { useTranslation } from "react-i18next";
import { Modal } from "zarm";
/*
 * @Author: lmk
 * @Date: 2021-07-15 14:16:46
 * @LastEditTime: 2021-08-27 14:13:30
 * @LastEditors: lmk
 * @Description: project util function
 */
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
  const success = ()=>{
    const data = Array.isArray(dataSource) ? [...dataSource] : {...dataSource}
    setdataSource(data)
  }
  const [likeLoading, setlikeLoading] = useState(false)
  const setLike = async val=>{
    try {
      if(likeLoading) return false;
      setlikeLoading(true)
      await liked(val)
      success()
      setlikeLoading(false)
    } catch (error) {
      setlikeLoading(false)
      return Promise.reject()
    }
  }
  const [followLoading, setfollowLoading] = useState(false)
  const loginModal = useLoginModal()
  const followPress = async (val,flag)=>{
    try {
      const item = flag ? val.parent_status : val;
      if(followLoading) return false;
      setfollowLoading(true)
      await followed(item)
      setfollowLoading(false)
      success()
    } catch (error) {
      error==='not found active user'&&loginModal()
      setfollowLoading(false)
      return Promise.reject()
    }
  }
  return {setLike,followPress}
}

export function useLoginModal(){
  const {t} = useTranslation()
  const loginModal = async ()=>{
    try {
      const {data:count} = await getListUsersCount();
      const flag = count > 0;
      const content = flag ? t('notLogin') : t('notRegister') ;
      Modal.confirm({
        title: 'Message',
        content,
        onCancel: () => {},
        onOk: () => {
          flag ? openLoginPage() : OpenCreateUserPanel();
        },
      });
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return loginModal
}