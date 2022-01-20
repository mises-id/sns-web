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
 * @LastEditTime: 2022-01-20 10:26:29
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

/**
 * @description: 
 * @param {*} fn getdatalist
 * @param {*} Get data list using parameters
 * @param {*} type Judge how to add data according to the type
 * @return {*}
 */
export function useList(fn,params={},listType={type:'refresh'}){
  let [last_id, setlast_id] = useState('');
  const [downRefreshLastId, setdownRefreshLastId] = useState('')
  let [dataSource, setdataSource] = useState([]);
  const fetchData = async type=>{
    try {
      const isRefresh = type==='refresh';
      const isRefreshList = listType.type==='refreshList';
      if(isRefresh&&!isRefreshList){
        last_id = '';
        setlast_id(last_id);
      }
      const res = await fn({...params,last_id:isRefreshList&&isRefresh ? downRefreshLastId : last_id});
      const {last_id:lastId} = res.pagination;
      if(isRefresh&&listType.type==='refresh'){
        dataSource = []
      }
      if(isRefresh&&isRefreshList){
        res.data.reverse()
        res.data.forEach(val=>dataSource.unshift(val))
        setdataSource(dataSource.slice(0,200)) // max length
        lastId&&setdownRefreshLastId(lastId)
        lastId&&setlast_id(lastId)
      }else{
        if(res.data.length!==0){
          setdownRefreshLastId(lastId)
        }
        setlast_id(lastId);
        setdataSource([...dataSource,...res.data]);
      }
      return Promise.resolve({
        ...res,
        listType,
      })
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

export function username(val={}){
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
 * @description: hours to  seconds
 * @param {string | number} hour  
 * @return {Number } seconds
 */
export function hoursToSeconds(hour){
  if(!hour) return 0;
  return Number(hour)*60*60
}
/**
* @param {*} 
*/
export function isMe(user,createdUserId){
  return false;
  if(!user || !createdUserId) return false;
  const {loginForm={}} = store.getState().user;
  return Number((user.uid || createdUserId))===Number(loginForm.uid)
}