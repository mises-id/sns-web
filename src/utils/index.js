import { setUserSetting } from "@/actions/user";
import { followed, liked } from "@/components/PostsIcons/common";
import { store } from "@/stores";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Modal } from "zarm";
/*
 * @Author: lmk
 * @Date: 2021-07-15 14:16:46
 * @LastEditTime: 2022-01-18 18:15:55
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
      console.log(followLoading)
      if(followLoading) return false;
      setfollowLoading(true)
      await followed(item)
      setfollowLoading(false)
      success()
    } catch (error) {
      console.log(error)
      setfollowLoading(false)
      error==='Wallet not activated'&&loginModal(()=>{
        followPress(val,flag)
      })
      return Promise.reject()
    }
  }
  return {setLike,followPress}
}

export function useLoginModal(){
  const loginModal = async (cb)=>{
    try {
      // const count = await window.mises.getMisesAccounts();
      // const flag = count > 0;
      // const content = flag ? t('notLogin') : t('notRegister') ;
      Modal.confirm({
        title: 'Message',
        content:'Please activate the user first',
        onCancel: () => {},
        onOk: () => {
          window.mises.requestAccounts().then(cb);
        },
      });
    } catch (error) {
      console.log(error)
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
  if(val.misesid&&val.misesid.length>26){
    const name = `${shortenAddress(val.misesid)}`
    return name.replace('did:mises:','')
  }
  return "Anonymous"
}
export function shortenAddress(
  address = ''
) {
  return `${address.slice(0, 18)}...${address.slice(
    -4,
  )}`;
}
export function formatTimeStr(time) {
  if(!time) return ''
  const yesterday = dayjs().subtract(1,'days').format('YYYYMMDD')
  const timeFormat = dayjs(time).format('YYYYMMDD')
  const now = dayjs().format('YYYYMMDD')
  if (now===timeFormat) {
    return dayjs(time).format('HH:mm')
  }
  if (yesterday===timeFormat) {
    return dayjs(time).format('[Yesterday] HH:mm')
  }
  return dayjs(time).format('DD MMM HH:mm')
}
/**
 * @description: set user list follow action
 * @param {Object} dataSource list 
 * @param {Function} setdataSource set list 
 * @param {String} keyStr key
 * @return {*}
 */
export function useSetDataSourceAction(dataSource,setdataSource,keyStr=""){
  const user = useSelector(state => state.user) || {userActions:{}}
  useEffect(() => {
    if(user.userActions.uid){
      const arr  = dataSource.map(val=>{
        let item = keyStr ? val[keyStr] : val;
        item = setFollowAction(item,user)
        if(item.parent_status){
          item.parent_status = setFollowAction(item.parent_status,user)
        }
        keyStr ? val[keyStr] = item  : val = item
        return val;
      })
      store.dispatch(setUserSetting({
        uid:'',
        actionType: ''
      }))
      setdataSource([...arr])
    }
     // eslint-disable-next-line
  }, [user.userActions.uid])
  const setFollowAction = val=>{
    const {uid,actionType} = user.userActions;
    if(uid===val.user.uid) val.user.is_followed = actionType==='following'
    return val;
  }
}
/**
 * @description: 
 * @param {*} element class or id element
 * @param {*} dataSource list
 * @param {*} lastid 
 * @return {*}
 */
const storageKey = 'storageCache';
export function useCachePageData(element,dataSource,lastid){
  const pull = document.querySelector(element);
  const [isSetListener, setisSetListener] = useState(false)
  const location = useLocation();
  const scroll = e=>{
    const {scrollTop} = e.target;
    console.log(scrollTop)
    cachePageData(scrollTop)
  }
  useEffect(() => {
    if(pull&&!isSetListener){
      setisSetListener(true)
      pull.addEventListener('scroll',scroll)
      console.log(pull)
    }
    return ()=>{
      pull&&pull.removeEventListener('scroll',scroll)
    }
    // eslint-disable-next-line
  }, [pull])
  sessionStorage.setItem(storageKey,JSON.stringify({
    [location.pathname]:{
      dataSource,
      lastid,
    }
  }));
  // const storageCache = sessionStorage.getItem(storageKey);
  const cachePageData = scrollTop=>{
    // console.log(obj)
    let storageCache = sessionStorage.getItem(storageKey);
    if(storageCache){
      storageCache = JSON.parse(storageCache);
      storageCache[location.pathname].scrollTop = scrollTop
      sessionStorage.setItem(storageKey,JSON.stringify(storageCache));
    }
  }
}

/**
 * @description: hours to  seconds
 * @param {string | number} hour  
 * @return {Number } seconds
 */
export function hoursToSeconds(hour){
  if(!hour) return 0;
  return Number(hour)*60*60
}