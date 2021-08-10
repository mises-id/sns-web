/*
 * @Author: lmk
 * @Date: 2021-07-15 23:43:29
 * @LastEditTime: 2021-08-10 13:51:11
 * @LastEditors: lmk
 * @Description: my post page
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@/styles/followPage.scss'
import UserHeader from '../Follows/UserHeader';
import Link from '../Follows/Link';
import PostsIcons from '@/components/PostsIcons';
import Image from '@/components/Image';
import send from '@/images/send.png'
import './index.scss'
import { deletePosts, myPostsData } from '@/api/status';
import PullList from '@/components/PullList';
import { liked } from '@/components/PostsIcons/common';
import Navbar from '@/components/NavBar';
import { useSelector } from 'react-redux';
import { Toast } from 'zarm';
import { useList } from '@/utils';
const MyPosts = ({history}) => {
  const user = useSelector(state => state.user)
  const setLike = (e,val)=>{
    liked(e,val).then(res=>{
      setDataSource([...dataSource])
    });
  }
  const forwardPress = (val)=>{
    history.push({pathname:'/forward'})
  }
  const goDetail = ()=>{
    history.push({pathname:'/post'})
  }
  const deleteItem = ({id},index)=>{
    deletePosts(id).then(res=>{
      Toast.show(t('deleteSuccess'));
      dataSource.splice(index,1);
      setDataSource([...dataSource]);
      if(dataSource.length===0){ //if empty 
        setlastId('')
        fetchData()
      }
    })
  }
  const [lastId, setlastId] = useState('')
  const [fetchData,last_id,dataSource,setDataSource] = useList(myPostsData,{
    uid:user.loginForm.uid,
    limit:5,last_id:lastId
  })
  //getData
  useEffect(() => {
    setlastId(last_id)
  }, [last_id])
  const createPosts = ()=>history.push({pathname:'/createPosts'})
  const {t} = useTranslation()
  //render item
  const renderView =(val={},index)=>{
    return <div key={index} className="m-padding15 m-bg-fff m-line-bottom" onClick={()=>goDetail(val)}>
      <UserHeader 
      item={{...val.user,from_type:val.from_type}}  
      deleteItem={()=>deleteItem(val,index)}
       btnType="myPosts" />
      <p className="itemContent m-font15 m-padding-tb15">{val.content}</p>
      {val.status_type==='link'&&<Link theme="primary"></Link>}
      {val.from_type==='forward'&&<div className="m-bg-f8f8f8 m-padding10">
        <UserHeader item={val} size={30}></UserHeader>
        <p className="itemContent m-font13 m-padding-tb10">It's a great website, share with you. Wow!!! Come and play with me.</p>
        <Link theme="white"></Link>
      </div>}
      <div className="m-margin-top12">
        <PostsIcons likeCallback={()=>setLike(val)} item={val} forwardCallback={()=>forwardPress(val)} />
      </div>
    </div>
  }
  return <div>
    <Navbar title={t('myPostPageTitle')}
    />
    <PullList renderView={renderView} data={dataSource} load={fetchData}></PullList>
    <div className="m-position-fixed createPosts">
      <Image size={75} onClick={createPosts} source={send}></Image>
    </div>
  </div>
}
export default MyPosts