/*
 * @Author: lmk
 * @Date: 2021-07-23 10:01:30
 * @LastEditTime: 2021-08-10 00:26:59
 * @LastEditors: lmk
 * @Description: global pull list
 */
import React, {  useEffect, useRef, useState } from 'react';
import {  Pull ,ActivityIndicator} from 'zarm';
import '@/styles/followPage.scss'
import Empty from '@/components/Empty';
const REFRESH_STATE = {
  normal: 0, 
  pull: 1, 
  drop: 2, 
  loading: 3, 
  success: 4, 
  failure: 5, 
};

const LOAD_STATE = {
  normal: 0, 
  abort: 1, 
  loading: 2, 
  success: 3, 
  failure: 4, 
  complete: 5, 
};
let mounted = true;
/**
 * @description: pull list 
 * @param {*}renderView:render item
 * @param {*}fetchData:request data
 * @param {*}isAuto:can you auto load
 * @return {*} element
 */
const PullList = ({renderView,data,isAuto=true,load}) => {
  const pullRef = useRef();
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  const [loading, setLoading] = useState(LOAD_STATE.normal);
  const [isOnceLoad, setisOnceLoad] = useState(true)
  const fetchData = type=>{
    return load(type).then(({pagination})=>{
      if(!pagination.last_id){
        setLoading(LOAD_STATE.complete)
      }
    }).catch(err=>{
      !isOnceLoad&&setLoading(LOAD_STATE.failure);
      setRefreshing(REFRESH_STATE.failure);
    }).finally(()=>setisOnceLoad(false)) //if once loading 
  }
  // refresh
  const refreshData = async () => {
    if (!mounted) return;
    setRefreshing(REFRESH_STATE.loading);
    try {
      await fetchData('refresh');
      setRefreshing(REFRESH_STATE.success);
    } catch (error) {
      setRefreshing(REFRESH_STATE.failure);
    }
  };
  // load more
  const loadData = async () => {
    if (!mounted) return;
    setLoading(LOAD_STATE.loading);
    try {
      await fetchData('load');
      setLoading(LOAD_STATE.success)
    } catch (error) {
      setLoading(LOAD_STATE.failure)
    }
  };
  useEffect(() => {
    isAuto&&fetchData()
    return () => {
      setisOnceLoad(true);
    };
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  return <>
    {isOnceLoad&&<div className="m-flex m-row-center m-padding20"><ActivityIndicator type="spinner"></ActivityIndicator></div>}
    {<Pull
      ref={pullRef}
      className='m-layout'
      refresh={{
        state: refreshing,
        handler: refreshData,
      }}
      load={{
        state: loading,
        distance: 200,
        handler: loadData,
      }}>
      {data.map(renderView)}
      {loading!==2&&data.length===0&&!isOnceLoad&&<Empty></Empty>}
    </Pull>}
  </>
}
export default PullList