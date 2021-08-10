/*
 * @Author: lmk
 * @Date: 2021-07-15 01:03:58
 * @LastEditTime: 2021-08-10 13:18:46
 * @LastEditors: lmk
 * @Description: 
 */
import Image from '@/components/Image/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Toast } from 'zarm';
import deteleIcon from '@/images/delete.png'
import { useLogin } from '@/components/PostsIcons/common';
const UserHeader = ({size,btnType="follow",item={},followed,deleteItem})=>{
  const {t} = useTranslation();
  const {isLogin} = useLogin();
  const hasLogin = (e,fn)=>{
    e.stopPropagation();
    if(!isLogin){
      Toast.show(t('notLogin'))
      return false;
    }
    fn&&fn()
  }
  const followedItem = e=>hasLogin(e,followed)
  const deleteItemClick = e=>hasLogin(e,deleteItem)
  return <div className={`m-flex m-row-between ${size ? 'forward' :'normal'}`}>
    <div className="m-flex">
      <Image size={size}/>
      <div className={!size ? 'm-margin-left12':'m-margin-left8'}>
        <span className='nickname'>{item.username}</span>
        <div className="timeAndType m-margin-top5">05.25<span className="m-margin-left5">post</span></div>
      </div>
    </div>
    {btnType==='follow'&&<Button icon={<Icon type="add" className="followIcon" theme="primary" />} shape="round" theme="primary" ghost size="xs" onClick={followedItem}>{t('followTxt')}</Button>}
    {btnType==='myPosts'&&<div className="btnStyle delete" onClick={deleteItemClick}>
      <Image source={deteleIcon} size={15} shape="square"></Image></div>}
  </div>
}
export default UserHeader