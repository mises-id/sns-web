/*
 * @Author: lmk
 * @Date: 2021-07-16 10:16:14
 * @LastEditTime: 2021-08-29 23:38:22
 * @LastEditors: lmk
 * @Description: PostsIcon : like comment forward
 */
import React from 'react';
import liked from '@/images/liked.png'
import like from '@/images/like.png'
import comment from '@/images/comment.png'
import forward from '@/images/forward.png'
import './index.scss'
import { useLogin } from './common';
import { useLoginModal } from '@/utils';
/**
 * @description: 
 * @param {*}forwardPress.type:function //click forward icon
 * @param {*}likePress.type:function //click like icon
 * @param {*}likePress.type:object //icon data
 * @return {*} element
 */
const PostsIcons = ({item={},likeCallback,forwardCallback,commentPage})=>{
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
  return  <div className="m-flex itemFunctionBox">
      <div className="m-flex"  onClick={likePress}>
        <img src={item.is_liked ? liked : like}  className="iconStyle" alt="like"></img>
        <span className={`m-font12 m-margin-left8 ${item.is_liked ? 'm-colors-FF3D62' : 'm-colors-333'}`}>{item.likes_count}</span>
      </div>
      <div className="m-flex" onClick={commentPage}>
        <img src={comment}  className="iconStyle" alt="comment"></img>
        <span className="m-font12 m-colors-333 m-margin-left8">{item.comments_count}</span>
      </div>
      <div className="m-flex" onClick={forwardPress}>
        <img src={forward}  className="iconStyle" alt="forward" ></img>
        <span className="m-font12 m-colors-333 m-margin-left8">{item.forwards_count}</span>
      </div>
    </div>
}
export default PostsIcons