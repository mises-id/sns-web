/*
 * @Author: lmk
 * @Date: 2021-07-08 15:08:05
 * @LastEditTime: 2021-07-15 16:42:50
 * @LastEditors: lmk
 * @Description: 
 */
import React from 'react';
import './index.scss'
import { useTranslation } from 'react-i18next';
import following from '@/images/following.png'
import followers from '@/images/followers.png'
import post from '@/images/post.png'
import Cell from '@/components/Cell';
const Myself = ({history})=>{
  const {t} = useTranslation()
  const list = [{
    label:t('following'),
    icon:following,
    url:'/follow',
    pageType:'following'
  },{
    label:t('followers'),
    icon:followers,
    url:'/follow',
    pageType:'followers'
  },{
    label:t('posts'),
    icon:post,
    url:''
  }]
  const userInfo = ()=>{
    history.push('/userInfo')
  }
  const cellClick = val=>{
    history.push({pathname:val.url,state:{pageType:val.pageType}})
  }
  return <div className="m-layout">
    <div className="m-padding-top15  m-bg-f8f8f8"></div>
    <div className="m-padding-lr15">
      <Cell iconSize={60}  label="Susan" onPress={userInfo}></Cell>
      {list.map((val,index)=>(<Cell showLine={false} icon={val.icon} iconSize={20} key={index}  label={val.label} onPress={()=>cellClick(val)}></Cell>))}
    </div>
  </div>
}
export default Myself