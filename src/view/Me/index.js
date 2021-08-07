/*
 * @Author: lmk
 * @Date: 2021-07-08 15:08:05
 * @LastEditTime: 2021-08-07 15:14:11
 * @LastEditors: lmk
 * @Description: 
 */
import React, { useEffect, useState } from 'react';
import './index.scss'
import { useTranslation } from 'react-i18next';
import following from '@/images/following.png'
import followers from '@/images/followers.png'
import post from '@/images/post.png'
import Cell from '@/components/Cell';
import { getUserSelfInfo } from '@/api/user';
import { setLoginForm } from '@/actions/user';
import { useDispatch, useSelector } from 'react-redux';
let flag = false;
const Myself = ({history})=>{
  const {t} = useTranslation();
  const {loginForm:user={}} = useSelector(state => state.user) || {}
  const [loginForm] = useState(user)
  const dispatch = useDispatch()
  const list = [{
    label:t('following'),
    icon:following,
    url:'/follow',
    pageType:'following'
  },{
    label:t('followers'),
    icon:followers,
    url:'/follow',
    pageType:'fans'
  },{
    label:t('posts'),
    icon:post,
    url:'/myPosts'
  }]
  //router to userInfo
  const userInfo = ()=>{
    history.push('/userInfo')
    flag = false
  }
  //click global cell 
  const cellClick = val=>{
    history.push({pathname:val.url,state:{pageType:val.pageType}})
    flag = false
  }
  const useReducer = useSelector(state => state.user)
  //get info 
  useEffect(() => {
    if(!flag){
      flag = true;
      if(useReducer.token){
        getUserSelfInfo().then(res=>{
          dispatch(setLoginForm(res))
        })
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="m-layout">
    <div className="m-padding-top15  m-bg-f8f8f8"></div>
    <div className="m-padding-lr15">
      <Cell iconSize={60} icon={loginForm.avatar&&loginForm.avatar.large} label={loginForm.username} onPress={userInfo}></Cell>
      {list.map((val,index)=>(<Cell showLine={false} icon={val.icon} iconSize={20} key={index}  label={val.label} onPress={()=>cellClick(val)}></Cell>))}
    </div>
  </div>
}
export default Myself