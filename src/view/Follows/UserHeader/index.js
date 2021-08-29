/*
 * @Author: lmk
 * @Date: 2021-07-15 01:03:58
 * @LastEditTime: 2021-08-29 16:29:39
 * @LastEditors: lmk
 * @Description: 
 */
import Image from '@/components/Image/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import deteleIcon from '@/images/delete.png'
import { useLogin } from '@/components/PostsIcons/common';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useLoginModal } from '@/utils';
import MButton from '@/components/MButton';
import addIcon from '@/images/add.png'
const UserHeader = ({size,btnType="follow",item={},followed,deleteItem})=>{
  const {t} = useTranslation();
  const {isLogin} = useLogin();
  const format = time=> time && dayjs(time).format('MM.DD')
  const {loginForm={}} = useSelector(state => state.user) || {};
  const isMe = loginForm.uid===item.uid;
  const loginModal = useLoginModal()
  const hasLogin = (e,fn)=>{
    e.stopPropagation();
    if(!isLogin){
      loginModal()
      return false;
    }
    fn&&fn()
  }

  const isFollow = item.is_followed ? 'followedTxt' : 'followTxt'
  const followedItem = e=>hasLogin(e,followed)
  const deleteItemClick = e=>hasLogin(e,deleteItem)
  return <div className={`m-flex m-row-between ${size ? 'forward' :'normal'}`}>
    <div className="m-flex">
      <Image size={size} source={item.avatar ? item.avatar.medium : ''}/>
      <div className={!size ? 'm-margin-left12':'m-margin-left8'}>
        <span className='nickname'>{item.username||'Anonymous'}</span>
        <div className={!size ? 'm-margin-top12 timeAndType' : 'm-margin-top8 timeAndType'}>{format(item.created_at)}<span className="m-margin-left3">{item.from_type}</span></div>
      </div>
    </div>
    {!isMe&&btnType==='follow'&&<MButton txt={t(isFollow)} onPress={followedItem} {...(item.is_followed ? {
      borderColor:"#DDDDDD",
      txtColor:'#666' 
    } : {})} imgIcon={!item.is_followed ? addIcon : ''} width={!size ? 70 : 60 } height={!size ? 25 : 20}/>}
    {btnType==='myPosts'&&<MButton iconSize={14} imgIcon={deteleIcon} borderColor="#DDDDDD" onPress={deleteItemClick}/>}
  </div>
}
export default UserHeader