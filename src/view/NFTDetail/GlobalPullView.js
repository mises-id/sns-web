/*
 * @Author: lmk
 * @Date: 2022-05-12 16:53:47
 * @LastEditTime: 2022-05-25 14:59:49
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
    const {to_account,from_account} = val;
    const address = to_account&&to_account.address ? to_account.address.substr(0,6)+'**********' : '';
    const userInfo = {
      avatar: from_account&&from_account.mises_user ? from_account.mises_user.avatar : {
        medium:from_account&&from_account.profile_img_url ? from_account.profile_img_url : '',
        nft_asset_id:'',
      },
      username:username(to_account&&to_account.mises_user ? to_account.mises_user : {},address),
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