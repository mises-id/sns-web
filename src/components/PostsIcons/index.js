/*
 * @Author: lmk
 * @Date: 2021-07-16 10:16:14
 * @LastEditTime: 2021-08-09 22:03:57
 * @LastEditors: lmk
 * @Description: PostsIcon : like comment forward
 */
import React from 'react';
import liked from '@/images/liked.png'
import like from '@/images/like.png'
import comment from '@/images/comment.png'
import forward from '@/images/forward.png'
import './index.scss'
/**
 * @description: 
 * @param {*}forwardPress.type:function //click forward icon
 * @param {*}likePress.type:function //click like icon
 * @param {*}likePress.type:object //icon data
 * @return {*} element
 */
const PostsIcons = ({item={},likePress,forwardPress})=>{
  return <div className="m-margin-top12 m-flex itemFunctionBox">
  <div className="m-flex"  onClick={(e)=>likePress(e,item)}>
    <img src={item.is_like ? liked : like}  className="iconStyle" alt="like"></img>
    <span className={`m-font12 m-margin-left8 ${item.is_like ? 'm-colors-FF3D62' : 'm-colors-333'}`}>{item.likes_count}</span>
  </div>
  <div className="m-flex">
    <img src={comment}  className="iconStyle" alt="comment"></img>
    <span className="m-font12 m-colors-333 m-margin-left8">{item.comments_count}</span>
  </div>
  <div className="m-flex" onClick={(e)=>forwardPress(e,item)}>
    <img src={forward}  className="iconStyle" alt="forward" ></img>
    <span className="m-font12 m-colors-333 m-margin-left8">{item.comments_count}</span>
  </div>
</div>
}
export default PostsIcons