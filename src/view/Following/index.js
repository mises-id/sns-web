/*
 * @Author: lmk
 * @Date: 2021-07-15 13:41:35
 * @LastEditTime: 2021-07-16 11:25:02
 * @LastEditors: lmk
 * @Description: Following and Followers page
 */
import Cell from '@/components/Cell';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, NavBar, Pull } from 'zarm';
import followed from '@/images/followed.png' //mutual following
// import follow from '@/images/follow.png' //follow
// import following from '@/images/isfollow.png' //following
import './index.scss';
import { useLocation } from 'react-router-dom';

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
const Following = ({history})=>{
  const {t} = useTranslation();
  const location = useLocation();
  const {state={}} = location || {}
  const type = state.pageType || 'following'
  const pageTitle = `${type}PageTitle`
  const pullRef = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  const [loading, setLoading] = useState(LOAD_STATE.normal);
  // 模拟请求数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    setTimeout(() => {
      if (!mounted) return;
      setDataSource(fetchData(20));
      setRefreshing(REFRESH_STATE.success);
    }, 2000);
  };
  const getRandomNum = (min, max) => {
    const Range = max - min;
    const Rand = Math.random();
    return min + Math.round(Rand * Range);
  };
  const renderView =(val={},index)=>{
    return <Cell iconSize={35} className="m-bg-fff m-padding-lr15 m-padding-tb12" showArrow={false} label="aaa" key={index}
    rightChild={<img className="followedIcon" src={followed} alt="followIcon"/>}></Cell>
  }
  //getData
  const fetchData = (length, dataSource = []) => {
    let newData = [].concat(dataSource);
    const startIndex = newData.length;
    for (let i = startIndex; i < startIndex + length; i++) {
      newData.push(renderView({},i));
    }
    return newData;
  };
  // 模拟加载更多数据
  const loadData = () => {
    setLoading(LOAD_STATE.loading);
    setTimeout(() => {
      console.log(mounted)
      if (!mounted) return;

      const randomNum = getRandomNum(0, 5);
      console.log(`状态: ${randomNum === 0 ? '失败' : randomNum === 1 ? '完成' : '成功'}`);

      let loadingState = LOAD_STATE.success;
      if (randomNum === 0) {
        loadingState = LOAD_STATE.failure;
      } else if (randomNum === 1) {
        loadingState = LOAD_STATE.complete;
      } else {
        setDataSource(fetchData(20, dataSource));
      }

      setLoading(loadingState);
    }, 2000);
  };
  useEffect(() => {
    setDataSource(fetchData(20));
    return () => {
      mounted = false;
    };
  }, []);
  return <div>
    <NavBar
      left={<Icon type="arrow-left" size="sm" onClick={() => window.history.back()} />}
      title={t(pageTitle)}
    />
    <div className="m-bg-f8f8f8">
      <Pull
        ref={pullRef}
        className="m-layout"
        style={{paddingTop:'10px'}}
        refresh={{
          state: refreshing,
          handler: refreshData,
        }}
        load={{
          state: loading,
          distance: 200,
          handler: loadData,
        }}>
        {dataSource}
      </Pull>
    </div>
  </div>
}
export default Following