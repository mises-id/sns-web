/*
 * @Author: lmk
 * @Date: 2021-07-15 23:43:29
 * @LastEditTime: 2021-07-16 13:54:59
 * @LastEditors: lmk
 * @Description: my post page
 */
import React, {  useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, NavBar, Pull } from 'zarm';
import UserHeader from '../Follows/UserHeader';
import Link from '../Follows/Link';
import '@/styles/followPage.scss'
import PostsIcons from '@/components/PostsIcons';
import Image from '@/components/Image';
import send from '@/images/send.png'
import './index.scss'
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
const MyPosts = ({history}) => {
  const pullRef = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  const [loading, setLoading] = useState(LOAD_STATE.normal);
  // 模拟请求数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    setTimeout(() => {
      if (!mounted) return;
      fetchData(20)
      setRefreshing(REFRESH_STATE.success);
    }, 2000);
  };
  const getRandomNum = (min, max) => {
    const Range = max - min;
    const Rand = Math.random();
    return min + Math.round(Rand * Range);
  };
  const setLike = (e,val)=>{
    e.stopPropagation()
    val.liked = !val.liked;
    const findIndex = dataSource.findIndex(item=>item.id===val.id);
    if(findIndex!==-1) {
      dataSource[findIndex] = val;
      setDataSource([...dataSource])
    }
  }
  const goDetail = ()=>{
    history.push({pathname:'/post'})
  }
  const renderView =(val={},index)=>{
    return <div key={index} className="m-padding15 m-bg-fff m-line-bottom" onClick={()=>goDetail(val)}>
      <UserHeader  btnType="myPosts"  ></UserHeader>
      <p className="itemContent m-font15 m-padding-tb15">It's a great website, share with you. Wow!!! Come and play with me.</p>
      {/* example */}
      {index===0&&<Link theme="primary"></Link>}
      {index===1&&<div className="m-bg-f8f8f8 m-padding10">
        <UserHeader size={30}></UserHeader>
        <p className="itemContent m-font13 m-padding-tb10">It's a great website, share with you. Wow!!! Come and play with me.</p>
        <Link theme="white"></Link>
        </div>}
      <div className="m-margin-top12">
        <PostsIcons likePress={setLike} item={val}></PostsIcons>
      </div>
    </div>
  }
  //getData
  const fetchData = (length) => {
    const newData = [];
    for (let i = 0; i < length; i++) {
      newData.push({id:dataSource.length+i});
    }
    setDataSource([...dataSource,...newData])
  };
  // 模拟加载更多数据
  const loadData = () => {
    setLoading(LOAD_STATE.loading);
    setTimeout(() => {
      if (!mounted) return;
      const randomNum = getRandomNum(0, 5);
      console.log(`状态: ${randomNum === 0 ? '失败' : randomNum === 1 ? '完成' : '成功'}`);

      let loadingState = LOAD_STATE.success;
      if (randomNum === 0) {
        loadingState = LOAD_STATE.failure;
      } else if (randomNum === 1) {
        loadingState = LOAD_STATE.complete;
      } else {
        fetchData(20)
      }
      setLoading(loadingState);
    }, 2000);
  };
  useEffect(() => {
    fetchData(20)
    return () => {
      mounted = false;
    };
  }, []);
  const createPosts = ()=>{
    history.push({pathname:'/createPosts'})
  }
  const {t} = useTranslation()
  return <div>
    <NavBar
      left={<Icon type="arrow-left" size="sm" onClick={() => window.history.back()} />}
      title={t('myPostPageTitle')}
    />
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
      {dataSource.map(renderView)}
    </Pull>
    <div className="m-position-fixed createPosts">
      <Image size={75} onClick={createPosts} source={send}></Image>
    </div>
  </div>
}
export default MyPosts