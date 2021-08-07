/*
 * @Author: lmk
 * @Date: 2021-07-15 23:43:29
 * @LastEditTime: 2021-07-23 15:10:52
 * @LastEditors: lmk
 * @Description: my post page
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, NavBar} from 'zarm';
import UserHeader from '../Follows/UserHeader';
import Link from '../Follows/Link';
import '@/styles/followPage.scss'
import PostsIcons from '@/components/PostsIcons';
import Image from '@/components/Image';
import send from '@/images/send.png'
import './index.scss'
import { getTimeline } from '@/api/status';
import PullList from '@/components/PullList';
import { liked } from '@/components/PostsIcons/common';
const MyPosts = ({history}) => {
  const [dataSource, setDataSource] = useState([]);
  const setLike = (e,val)=>{
    liked(e,val).then(res=>{
      setDataSource([...dataSource])
    });
  }
  const goDetail = ()=>{
    history.push({pathname:'/post'})
  }
  //getData
  const fetchData = async () => {
    try {
      const {timeline} = await getTimeline();
      setDataSource([...dataSource,...timeline])
    } catch (error) {
      return Promise.reject(new Error('load error'))
    }
  };
  const createPosts = ()=>history.push({pathname:'/createPosts'})
  const {t} = useTranslation()
  //render item
  const renderView =(val={},index)=>{
    return <div key={index} className="m-padding15 m-bg-fff m-line-bottom" onClick={()=>goDetail(val)}>
      <UserHeader  btnType="myPosts"></UserHeader>
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
  return <div>
    <NavBar
      left={<Icon type="arrow-left" size="sm" onClick={() => window.history.back()} />}
      title={t('myPostPageTitle')}
    />
    <PullList renderView={renderView} data={dataSource} load={fetchData}></PullList>
    <div className="m-position-fixed createPosts">
      <Image size={75} onClick={createPosts} source={send}></Image>
    </div>
  </div>
}
export default MyPosts