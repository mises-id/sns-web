/*
 * @Author: lmk
 * @Date: 2021-07-23 10:01:30
 * @LastEditTime: 2022-03-30 11:07:52
 * @LastEditors: lmk
 * @Description: global pull list
 */
import React, { useEffect, useRef, useState } from "react";
import { Pull } from "zarm";
import "@/styles/followPage.scss";
import Empty from "@/components/Empty";
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
const PullList = ({ renderView, data=[], isAuto = true, load, otherView,getSuccess }) => {
  const pullRef = useRef();
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  const [loading, setLoading] = useState(LOAD_STATE.normal);
  const [isOnceLoad, setisOnceLoad] = useState(true);
  const [lastId, setlastId] = useState("");
  const fetchData = async (type) => {
    const flag =
      loading === LOAD_STATE.loading || refreshing === REFRESH_STATE.loading;
    if (flag) return false;
    try {
      const res = await load(type);
      if (res) {
        setisOnceLoad(false)
        console.log(res,lastId)
        if (res.data.length > 0) {
          getSuccess()
        }
        if(type==='refresh'&&res.listType.type==='refreshList'&&res.data.length===0){
          return false;
        }
        const last_id = res.pagination.last_id;
        if(res.data.length<10){
          setLoading(LOAD_STATE.complete)
          setlastId('');
        }else{
          setlastId(last_id);
        }
        console.log('last_id',last_id)
        return Promise.resolve(true)
      }
    } catch (error) {
      !isOnceLoad && setLoading(LOAD_STATE.failure);
      setRefreshing(REFRESH_STATE.normal);
      setisOnceLoad(false)
      return Promise.reject(error)
    }
  };
  // refresh
  const refreshData = async () => {
    if (!mounted) return;
    setRefreshing(REFRESH_STATE.loading);
    try {
      await fetchData("refresh");
      setRefreshing(REFRESH_STATE.success);
    } catch (error) {
      setRefreshing(REFRESH_STATE.failure);
    }
  };
  // load more
  const loadData = async () => {
    // if (lastId) return;
    if(!lastId&&data.length>0) return false;
    setLoading(LOAD_STATE.loading);
    try {
      await fetchData("load");
      loading !== LOAD_STATE.complete && setLoading(LOAD_STATE.success);
    } catch (error) {
      setLoading(LOAD_STATE.failure);
    }
  };
  useEffect(() => {
    isAuto && refreshData();
    if (!isAuto) setisOnceLoad(false);
    return () => {
      setisOnceLoad(true);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps 
  return (
    <>
      {/* {isOnceLoad && (
        <div className="m-flex m-row-center m-padding20">
          <ActivityIndicator type="spinner"></ActivityIndicator>
        </div>
      )} */}
      <Pull
        ref={pullRef}
        className="m-layout"
        stayTime={300}
        refresh={{
          state: refreshing,
          handler: refreshData,
        }}
        load={{
          state: loading,
          distance: 200,
          handler: loadData,
        }}
      >
        {loading !== 2 && !isOnceLoad && otherView && otherView()}
        {data.map(renderView)}
        {loading !== 2 && data.length === 0 && !isOnceLoad && <Empty></Empty>}
        {/* {loading===3&&data.length >0&&<div className="pull-empty">-- No more data --</div>} */}
      </Pull>
    </>
  );
};
export default PullList;
