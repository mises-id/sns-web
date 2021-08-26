/*
 * @Author: lmk
 * @Date: 2021-07-15 16:07:01
 * @LastEditTime: 2021-08-26 14:06:13
 * @LastEditors: lmk
 * @Description: comment
 */

import './index.scss';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Input, Toast } from 'zarm';
import Image from '@/components/Image';
import write from '@/images/write.png'
import PullList from '@/components/PullList';
import Navbar from '@/components/NavBar';
import { useBind, useList } from '@/utils';
import { getComment } from '@/api/status';
import { createComment } from '@/api/comment';
import { useSelector } from 'react-redux';

const Comment = ({history})=>{
  const {t} = useTranslation();
  const state = history?.location?.state || {};
  const renderView =(val={},index)=>{
    return <div key={index} className="m-flex m-col-top m-padding-top10">
    <Image size={30} source={val.user.avatar ? val.user.avatar.medium : ''}></Image>
    <div className="m-margin-left12 m-line-bottom m-flex-1">
      <span className="commentNickname">{val.user.username}</span>
      <p className="m-font15 m-colors-555  m-padding-bottom10">{val.content}</p>
    </div>
  </div>
  }
  //getData
  const [lastId, setlastId] = useState('')
  const [fetchData,last_id,dataSource,setdataSource] = useList(getComment,{
    status_id:state.id,
    limit:20,last_id:lastId
  })
  const user = useSelector(state => state.user)||{};
  const [loading, setloading] = useState(false)
  useEffect(() => {
    setlastId(last_id)
  }, [last_id])
  const commentContent = useBind('');
  const submit = e=>{
    e.preventDefault()
    if(!user.token){
      Toast.show(t('notLogin'))
      return false;
    }
    if(loading || !commentContent.value){
      return false
    }
    setloading(true);
    createComment({
      content:commentContent.value,
      status_id:state.id
    }).then(res=>{
      dataSource.unshift(res);
      setdataSource([...dataSource])
      commentContent.onChange('')
    }).finally(()=>{
      setloading(false);
    })
  }
  return <div className="m-flex m-flex-col page">
    <Navbar title={t('commentPageTitle')}
    />
    <div className="m-padding-left15 m-flex-1 commentBox">
      <PullList renderView={renderView} data={dataSource} load={fetchData}></PullList>
    </div>
    <div className="footer m-bg-fff">
      <div className="m-flex">
        <Image size={30}></Image>
        <div className="comment m-flex-1 m-flex m-padding-lr15">
          <div className="m-margin-right5"><Image source={write} size={16} shape="square"></Image></div>
          <form onSubmit={submit} className="m-flex-1">
              <Input placeholder="Write a comment..." {...commentContent} type="text"></Input>
            </form>
        </div>
      </div>
    </div>
  </div>
}
export default Comment