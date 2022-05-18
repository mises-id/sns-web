/*
 * @Author: lmk
 * @Date: 2022-05-12 16:53:47
 * @LastEditTime: 2022-05-18 10:17:54
 * @LastEditors: lmk
 * @Description: 
 */
import { comment } from "@/api/comment";
import { NFTEvent, NFTLikeList } from "@/api/user";
import PullList from "@/components/PullList";
import { formatTimeStr, useChangePosts, useList, username } from "@/utils";
import React,{ useEffect, useState } from "react";
import UserHeader from "../Follows/UserHeader";
import Avatar from "@/components/NFTAvatar";

export const GlobalPullView = ({type,nftInfo})=>{
  const { followPress } = useChangePosts();
  const likeRenderView = (val,index) => {
    return <div className="nft-user-item" key={index} >
      <UserHeader
        followed={()=>followPress(val)}
        size="35px" 
        item={{...val.user,is_public:true}} />
    </div>
  }
  // comment tab content
  const commentRenderView = (val,index)=>{
    return <div>CommentContent</div>
  }
  // activity tab content
  const activeRender = (val,index) => {
    const {to_account} = val;
    const userInfo = {
      avatar: to_account.mises_user ? to_account.mises_user.avatar : {
        medium:to_account.profile_img_url,
        nft_asset_id:'',
      },
      username:username(to_account.mises_user || {},'0x*********'),
      event_type: val.event_type,
      created_at:val.created_date
    }
    return <div className="activity-user m-flex" key={index}>
      <Avatar avatarItem={userInfo.avatar} size="30px"/>
      <div className="activity-user-content">
        <div className="activity-user-name">{userInfo.event_type} To <span>{userInfo.username}</span></div>
        <div className="activity-user-time">{formatTimeStr(userInfo.created_at)}</div>
      </div>
    </div>
  }
  const typeObj = {
    like: {
      fn:NFTLikeList,
      renderView: likeRenderView
    },
    activity: {
      fn:NFTEvent,
      renderView: activeRender
    },
    comment:{
      fn:comment,
      renderView: commentRenderView
    }
  }[type]
  const [lastId, setlastId] = useState("");
  const [fetchData, last_id, dataSource] = useList(typeObj.fn, {
    id:nftInfo.id,
    nft_asset_id:nftInfo.id,
    limit: 20,
    last_id: lastId,
  });
  //getData
  useEffect(() => {
    setlastId(last_id);
  }, [last_id]);
  return <PullList
    isAuto
    key={type}
    renderView={typeObj.renderView}
    data={dataSource}
    load={fetchData}
  />
}