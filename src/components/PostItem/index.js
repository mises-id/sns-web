/*
 * @Author: lmk
 * @Date: 2021-08-12 22:28:09
 * @LastEditTime: 2021-08-16 23:32:07
 * @LastEditors: lmk
 * @Description: 
 */
import Link from '@/view/Follows/Link';
import UserHeader from '@/view/Follows/UserHeader';
import React from 'react';
import PostsIcons from '../PostsIcons';
import '@/styles/followPage.scss'
const PostItem = ({val={},index,history,changeFollow,setLike,btnType,deleteItem})=>{
  const goDetail = item=>{
    history.push({pathname:'/post',state:{id:item.id}})
  }
  const forwardPress = ()=>{
    const id = val.parent_status ? val.parent_status.id : val.id
    history.push({pathname:'/forward',state:{id}})
  }
  const commentPage = ()=>{
    console.log(val.id)
    history.push({pathname:'/comment',state:{id:val.id}})
  }
  return <div key={index} className="m-padding15 m-bg-fff m-line-bottom" onClick={()=>goDetail(val)}>
  <UserHeader item={{...val.user,from_type:val.from_type,created_at:val.created_at}}  followed={()=>changeFollow(val)} btnType={btnType} deleteItem={deleteItem}></UserHeader>
  <p className="itemContent m-font15 m-padding-tb15">{val.content}</p>
  {/* example */}
  {val.status_type==='link'&&<Link theme="primary" item={val.link_meta}></Link>}
  {val.from_type==='forward'&&<div className="m-bg-f8f8f8 m-padding10">
    <UserHeader item={{...val.parent_status.user,from_type:val.parent_status.from_type,created_at:val.parent_status.created_at}} size={30} followed={()=>changeFollow(val,!!val.parent_status)}></UserHeader>
    <p className="itemContent m-font13 m-padding-tb10">{val.parent_status.content}</p>
    {val.parent_status.status_type==='link'&&<Link theme="white" item={val.parent_status.link_meta}></Link>}
    <p className="forwardPostsData">like {val.parent_status.likes_count} · comment {val.parent_status.comments_count} · foward {val.parent_status.forwards_count}</p>
  </div>}
  <div className="m-margin-top12">
    <PostsIcons likeCallback={()=>setLike(val)} commentPage={commentPage} item={val} forwardCallback={()=>forwardPress(val)} />
  </div>
</div>
}
export default PostItem