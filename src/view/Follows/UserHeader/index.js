/*
 * @Author: lmk
 * @Date: 2021-07-15 01:03:58
 * @LastEditTime: 2021-08-18 00:33:50
 * @LastEditors: lmk
 * @Description: 
 */
import Image from '@/components/Image/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Modal } from 'zarm';
import deteleIcon from '@/images/delete.png'
import { useLogin } from '@/components/PostsIcons/common';
import dayjs from 'dayjs';
import {getListUsersCount, OpenCreateUserPanel, openLoginPage } from '@/utils/postMessage';
import { useSelector } from 'react-redux';
const UserHeader = ({size,btnType="follow",item={},followed,deleteItem})=>{
  const {t} = useTranslation();
  const {isLogin} = useLogin();
  const format = time=> dayjs(time).format('MM.DD')
  const {loginForm={}} = useSelector(state => state.user) || {};
  const isMe = loginForm.uid===item.uid;
  const hasLogin = async (e,fn)=>{
    e.stopPropagation();
    if(!isLogin){
      try {
        const {data:count} = await getListUsersCount();
        const flag = count > 0;
        const content = flag ? t('notLogin') : t('notRegister') ;
        Modal.confirm({
          title: 'Message',
          content,
          onCancel: () => {},
          onOk: () => {
            flag ? openLoginPage() : OpenCreateUserPanel();
          },
        });
      } catch (error) {
        console.log(error)
      }
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
        <span className='nickname'>{item.username||'notName'}</span>
        <div className="timeAndType m-margin-top5">{format(item.created_at)}<span className="m-margin-left5">{item.from_type}</span></div>
      </div>
    </div>
    {!isMe&&btnType==='follow'&&<Button style={item.is_followed ? {
      borderColor:"#DDDDDD",
      color:'#666666'
    } : {}} icon={!item.is_followed&&<Icon type="add" className="followIcon" theme="primary" />} shape="round" theme={!item.is_followed ? "primary" : ""} ghost size="xs" onClick={followedItem}><span>{t(isFollow)}</span></Button>}
    {btnType==='myPosts'&&<div className="btnStyle delete" onClick={deleteItemClick}>
      <Image source={deteleIcon} size={15} shape="square"></Image></div>}
  </div>
}
export default UserHeader