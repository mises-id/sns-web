/*
 * @Author: lmk
 * @Date: 2021-07-23 10:01:30
 * @LastEditTime: 2021-08-06 18:17:36
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
    return load(type).then(({pagination:{total_pages,page_num}})=>{
      if(total_pages===page_num){
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
    setLoading(LOAD_STATE.normal)
    setRefreshing(REFRESH_STATE.loading);
    try {
      const data = await fetchData('refresh');
      console.log(data)
      setRefreshing(REFRESH_STATE.success);
    } catch (error) {
    }
  };
  const getRandomNum = (min, max) => {
    const Range = max - min;
    const Rand = Math.random();
    return min + Math.round(Rand * Range);
  };
  
  // load more
  const loadData = async () => {
    if (!mounted) return;
    setLoading(LOAD_STATE.loading);
    const randomNum = getRandomNum(0, 5);
    console.log(`状态: ${randomNum === 0 ? '失败' : randomNum === 1 ? '完成' : '成功'}`);

    let loadingState = LOAD_STATE.success;
    if (randomNum === 0) {
      loadingState = LOAD_STATE.failure;
    } else if (randomNum === 1) {
      loadingState = LOAD_STATE.complete;
    }
    try {
      await fetchData('load');
    } catch (error) {
      
    }
    setLoading(loadingState);
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