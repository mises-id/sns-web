import { followed, liked } from "@/components/PostsIcons/common";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Modal } from "zarm";
/*
 * @Author: lmk
 * @Date: 2021-07-15 14:16:46
 * @LastEditTime: 2022-01-13 10:44:46
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
export function urlToJson(url = window.location.href) {

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

export function objToUrl(object){
  if(JSON.stringify(object).indexOf("{")>-1&&JSON.stringify(object).indexOf("}")>-1){
    let query = '';
    console.log(object)
    for (const key in object) {
      const element = object[key];
      if(element) query+=`${query==='' ? '?' : '&'}${key}=${element}`
    }
    return query
  }
  return ''
}

/**
 * @description: 
 * @param {*} funtion fn getdatalist
 * params request data
 * @return {*}
 */

export function useList(fn,params={}){
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
  const location = useLocation();
  const {search} = location || {}
  const historyState = urlToJson(search)
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
      console.log(error)
      error==='not found active user'&&loginModal(()=>{
        followPress(val,flag)
      })
      setfollowLoading(false)
      return Promise.reject()
    }
  }
  return {setLike,followPress}
}

export function useLoginModal(){
  const {t} = useTranslation()
  const loginModal = async (cb)=>{
    try {
      const count = await window.mises.getMisesAccounts();
      const flag = count > 0;
      const content = flag ? t('notLogin') : t('notRegister') ;
      Modal.confirm({
        title: 'Message',
        content,
        onCancel: () => {},
        onOk: () => {
          window.mises.requestAccounts().then(cb);
        },
      });
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return loginModal
}
export const shareWith = [{
  label:'Public',
  value:'public'
},{
  label:'Private',
  value:'private'
},{
  label:'Time Limited Post',
  value:'limited'
}]
export function getShareWithObj(value){
  return shareWith.find(val=>val.value===value) || {}
}

export function username(val){
  if(val.username) return val.username;
  if(val.misesid&&val.misesid.length>8){
    const startNum = val.misesid.length - 8;
    const str = val.misesid.substr(startNum)
    return `misesid:${str}`
  }
  return "Anonymous"
}
export function formatTimeStr(time) {
  if(!time) return ''
  const diff = dayjs().diff(dayjs(time)) 
  if (diff < 3600 * 24 * 1000) {
    return dayjs(time).format('HH:mm')
  }
  if (diff < 3600 * 24 * 2 * 1000) {
    return dayjs(time).format('[Yesterday] HH:mm')
  }
  return dayjs(time).format('DD MMM HH:mm')
}