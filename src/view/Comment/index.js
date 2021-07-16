/*
 * @Author: lmk
 * @Date: 2021-07-15 16:07:01
 * @LastEditTime: 2021-07-16 11:24:38
 * @LastEditors: lmk
 * @Description: comment
 */

import './index.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Input, NavBar, Pull } from 'zarm';
import Image from '@/components/Image';
import write from '@/images/write.png'
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
const Comment = (props)=>{
  const {t} = useTranslation()
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
    return <div key={index} className="m-flex m-col-top m-padding-top10">
    <Image size={30}></Image>
    <div className="m-margin-left12 m-line-bottom">
      <span className="commentNickname">Emma</span>
      <p className="m-font15 m-colors-555  m-padding-bottom10 m-padding-right15">It's a great website, share with you. Wow!!! Come and play with me.</p>
    </div>
  </div>
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
  return <div className="m-flex m-flex-col page">
    <NavBar
      left={<Icon type="arrow-left" size="sm" onClick={() => window.history.back()} />}
      title={t('commentPageTitle')}
    />
    <div className="m-padding-left15 m-flex-1 commentBox">
      <Pull
        ref={pullRef}
        className="m-layout"
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
    <div className="footer m-bg-fff">
      <div className="m-flex">
        <Image size={30}></Image>
        <div className="comment m-flex-1 m-flex m-padding-lr15">
          <div className="m-margin-right5"><Image source={write} size={16} shape="square"></Image></div>
          <Input placeholder="Write a comment..." type="text"></Input>
        </div>
      </div>
    </div>
  </div>
}
export default Comment