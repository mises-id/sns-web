/*
 * @Author: lmk
 * @Date: 2021-07-16 10:16:14
 * @LastEditTime: 2022-04-15 14:22:55
 * @LastEditors: lmk
 * @Description: PostsIcon : like comment forward
 */
import React from 'react';
import liked from '@/images/liked.png'
import like from '@/images/like.png'
import comment from '@/images/comment.png'
import forward from '@/images/forward.png'
import shareTo from '@/images/shareto.png'
import './index.scss'
import { useLogin } from './common';
import { useLoginModal } from '@/utils';
import { Toast } from 'zarm';
import { useSelector } from 'react-redux';
/**
 * @description: 
 * @param {Function}forwardPress.type click forward icon
 * @param {Function}likePress.type click like icon
 * @param {Object}likePress.type icon data
 * @return {Element} element
 */
const PostsIcons = ({item={},likeCallback,forwardCallback,commentPage,type})=>{
  const {isLogin} = useLogin();
  const loginModal = useLoginModal()
  const hasLogin = (e,fn)=>{
    e.stopPropagation();
    if(!isLogin){
      loginModal()
      return false;
    }
    fn&&fn()
  }
  const forwardPress = e=>hasLogin(e,forwardCallback)
  const likePress = e=>hasLogin(e,likeCallback)
  const selector = useSelector((state) => state.user) || {};
  const sharetoPress = e=>{
    e.stopPropagation();
    if(!navigator.share){
      Toast.show('Browser cannot share website')
    }
    const misesid = isLogin ? `&misesid=${selector.loginForm.misesid}` : ''
    navigator.share&&navigator.share({
      text: '',
      url: `${window.location.origin}/post?id=${item.id}&${misesid}`,
    }).catch(err=>{
      console.log(err)
    })
  }
  const typeClassName = !type ? {fontClass:'m-font12',iconClass:'iconStyle'} : {fontClass:'m-font14',iconClass:'iconStyle1'}
  return  <div className="m-flex itemFunctionBox">
      <div className="m-flex"  onClick={likePress}>
        <img src={item.is_liked ? liked : like}  className={typeClassName.iconClass} alt="like"></img>
        <span className={`${typeClassName.fontClass} m-margin-left8 ${item.is_liked ? 'm-colors-FF3D62' : 'm-colors-333'}`}>{item.likes_count}</span>
      </div>
      <div className="m-flex" onClick={(e)=>{
        commentPage(e)
      }}>
        <img src={comment}  className={typeClassName.iconClass} alt="comment"></img>
        <span className={`${typeClassName.fontClass} m-colors-333 m-margin-left8`}>{item.comments_count}</span>
      </div>
      <div className="m-flex" onClick={forwardPress}>
        <img src={forward}  className={typeClassName.iconClass} alt="forward" ></img>
        <span className={`${typeClassName.fontClass} m-colors-333 m-margin-left8`}>{item.forwards_count}</span>
      </div>
      <div className="m-flex" onClick={sharetoPress}>
        <img src={shareTo}  className={typeClassName.iconClass} alt="forward" ></img>
      </div>
    </div>
}
export default PostsIcons