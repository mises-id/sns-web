/*
 * @Author: lmk
 * @Date: 2021-07-15 23:43:29
 * @LastEditTime: 2022-05-18 17:48:18
 * @LastEditors: lmk
 * @Description: my post page
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/styles/followPage.scss";
import "./index.scss";
import PullList from "@/components/PullList";
import Navbar from "@/components/NavBar";
import {
  formatTimeStr,
  objToUrl,
  useList,
  username,
  useRouteState,
} from "@/utils";
import {Image} from "antd-mobile";
import like from "@/images/like.png";
import CommentsPop from "@/view/Comment/commentPop";
import cry from '@/images/cry.png';
import {
  getNotificationList,
  uploadNotificationState,
} from "@/api/notifications";
import { useDispatch } from "react-redux";
import { setFollowingBadge } from "@/actions/user";
import { useRef } from "react";
import { getCommentId, likeComment, removeComment, unlikeComment } from "@/api/comment";
import { Modal } from "zarm";
import { dropByCacheKey, useDidRecover } from "react-router-cache-route";
import Avatar from '@/components/NFTAvatar'
const Notifications = ({ history }) => {
  const [lastId, setlastId] = useState("");
  const state = useRouteState();
  // const selector = useSelector((state) => state.user) || {};
  const [fetchData, last_id, dataSource] = useList(getNotificationList, {
    last_id: lastId,
    limit: 20,
    state: state.notificationsType || 'all',
  });
  //getData
  const [isseting, setisseting] = useState(false);
  const dispatch = useDispatch(null);
  const readData = ()=>{
    if (dataSource.length>0) {
      uploadNotificationState({ latest_id: dataSource[0].id }).then((res) => {
        dispatch(
          setFollowingBadge({
            total: 0,
            notifications_count: 0,
          })
        );
        setisseting(true);
      }).catch((error) => {});
    }
  }
  useEffect(() => {
    setlastId(last_id);
    if(!isseting) readData()
  }, [dataSource.length]); // eslint-disable-line react-hooks/exhaustive-deps
  // const createPosts = () => history.push({ pathname: "/createPosts" });
  const { t } = useTranslation();
  const commentsPopRef = useRef();
  const goDetail = ({ status,nft_asset}) => {
    status&&history.push({
      pathname: "/post",
      search: objToUrl({ id: status.id }),
    });
    nft_asset&&history.push({
      pathname: "/NFTDetail",
      search:objToUrl({
        tokenId:nft_asset.id,
        image:nft_asset.image_url,
      })
    })
  };
  const detail = async val => {
    const { status,message_type,user,meta_data,created_at,comment_is_deleted } = val
    if(!['new_comment','new_like_comment'].includes(message_type)){
      goDetail(val)
    }else{
      if(!status || comment_is_deleted) return false; // If the comment is deleted or the post is deleted
      const topic_id = meta_data.group_id || meta_data.comment_id
      const res = await getCommentId(topic_id)
      res.username = username(res.user);
      console.log(res);
      setcommentPop({
        state_id:status.id,
        id:topic_id,
        ...res
      })
      if(meta_data.group_id){// child comment
        const opponentUser = {};
        meta_data.parent_username.indexOf('did:mises')===-1 ? opponentUser.username = meta_data.parent_username : opponentUser.misesid = meta_data.parent_username
        const obj = {
          user,
          content:meta_data.content,
          created_at,
          opponent:opponentUser,
          id:meta_data.comment_id
        }
        commentsPopRef.current.setData(obj)
        commentsPopRef.current.setTopCommentId(meta_data.comment_id)
      }
      // replyItem({
      //   user,
      //   content:meta_data.content,
      //   id:meta_data.comment_id,
      //   topic_id:res.id
      // })
      setvisible(true)
    }
  };

  const [visible, setvisible] = useState(false);
  const [commentPop, setcommentPop] = useState({});
  // const [, setselectItem] = useState({});
  // const replyItem = (val) => {
  //   val.username = username(val.user);
  //   console.log(val,'qwww');
  //   // setselectItem(val);
  // };
  const likePress = (e,val) =>{
    e.stopPropagation();
    const fn = val.is_liked ? unlikeComment : likeComment;
    fn(val.id)
      .then((res) => {
        val.is_liked = !val.is_liked;
        val.likes_count = val.is_liked ? ++val.likes_count : --val.likes_count;
        setcommentPop({...val})
      })
      .catch((res) => {});
  }
  const deleteCommentData = (e,val)=>{
    e.stopPropagation()
    Modal.confirm({
      title: 'Message',
      width:'83%',
      content: 'Are you sure to delete this comment?',
      onCancel: () => {
      },
      onOk: () => {
        removeComment(val.id).then(res=>{
          // getCommentList(state.id);
          if(visible){  // If the pop is displayed and the first level comment is deleted
            if(!val.topic_id){ // top comment
              setvisible(false)
              setcommentPop('')
              return false;
            }
            if(val.topic_id){ // next comment
              commentsPopRef.current.removeItem(val.id)
            }
          }
          // const findItemIndex = dataSource.findIndex(item=>item.id===(val.topic_id || val.id));
          // if(val.topic_id){
          //   const findChildIndex = dataSource[findItemIndex].comments.findIndex(item=>item.id===val.id);
          //   dataSource[findItemIndex].comments.splice(findChildIndex,1)
          //   dataSource[findItemIndex].comments_count-=1
          // }
          // if(!val.topic_id){
          //   dataSource.splice(findItemIndex,1)
          // }
          // setdataSource([...dataSource])
        }).catch(error=>{
          console.log(error,23213);
        })
      },
    });
  }
  //render item
  const renderView = (val = {}, index) => {
    const user = val.user || {};
    return (
      <div
        className="item m-flex m-line-bottom"
        key={index}
        onClick={() => detail(val)}
      >
        <Avatar avatarItem={user.avatar} size="40px" onClick={e=>userDetail(e,user)}/>
        <div className="avatar-item m-flex-1" style={{width:0}}>
          <p className="user-name m-colors-111">{username(user)}</p>
          {notificationsType(val)}
          <p className="time-view">{formatTimeStr(val.created_at)}</p>
        </div>
        <div onClick={e=>{
          e.stopPropagation()
          goDetail(val)
        }}>
          {rightView(val)}
        </div>
      </div>
    );
  };
  const userDetail = (e,user)=>{
    e.stopPropagation()
    const avatar = user.avatar ? user.avatar.medium : "";
    history.push({
      pathname: "/userDetail",
      search: objToUrl({ uid: user.uid, username: user.username, avatar,is_followed: user.is_followed,misesid:user.misesid }),
    });
  }
  const rightView = ({ status,meta_data={},message_type,nft_asset}) => {
    const image = status&&message_type!=='new_like_comment'&&returnImage(status)
    const nftImage = nft_asset && nft_asset.image_preview_url
    const source = image || nftImage
    return <div className="right-view">
        {source&&<Image
          width={60}
          height={60}
          alt="image"
          style={{borderRadius:'3px'}}
          src={source} />}
        {!source&&meta_data&&<div>
          <p className="post-content item-eli">{
            meta_data.content_summary || 
            meta_data.comment_content || 
            meta_data.status_content_summary || 
            meta_data.status_content
          }</p>
        </div>}
      </div>
  };
  const returnImage = (status={})=>{
    switch (status.status_type) {
      case 'image': // if this is a image status
        return status.thumb_images[0];
      case 'text': // if this is a text status
        if(status.parent_status){ // if this parent status is a image status
          return returnImage(status.parent_status)
        }
        return ''
        // if this is a link status
      case 'link':
        return status.link_meta.attachment_url;
      default:
        return ''
    }
  }
  const notificationsType = (val) => {
    const metaData = val.meta_data;
    //type :new_comment, new_like, new_fans, new_forward
    switch (val.message_type) {
      case "new_like_status":
      case "new_like_nft":
      case "new_like_comment":
      case "new_like_nft_comment":
        return (
          <div className="like-icon">
            <Image src={like} width={16} height={16}></Image>
          </div>
        );
      case "new_fowards":
        return (
          <div>
            <p className="forward">Forward your post</p>
            <p className="item-content">{metaData.forward_content}</p>
          </div>
        );
      case "new_comment": 
      case "new_nft_comment": 
        const obj = {};
        if(metaData.parent_username.indexOf('did:mises')>-1){
          obj.misesid = metaData.parent_username
        }else{
          obj.username = metaData.parent_username
        }
        return (
          <div>
            {metaData.content && !val.comment_is_deleted &&(
              <p className="item-content">{metaData.content}</p>
            )}
            {val.comment_is_deleted &&(
              <div className="deleteStatus notification-delete m-flex m-row-center">
                <img src={cry} alt="" width={13}/>
                <span className="delete-txt">{t('notificationPostDelete')}</span>
              </div>
            )}
            
            {metaData.parent_content&&<div className="parent-content">
              <span className="at">@{username(obj)}:</span> <span>{metaData.parent_content}</span>
            </div>}
          </div>
        );
      default:
        return "";
    }
  };
  useDidRecover(()=>{
    dropByCacheKey('/post')
  })
  return (
    <div>
      <Navbar title={t("NotificationsPageTitle")} />
      <PullList
        renderView={renderView}
        data={dataSource}
        load={async (e)=>{
          e==='refresh'&&readData()
          const res = await fetchData(e)
          return res;
        }}></PullList>
      <CommentsPop
        visible={visible}
        setvisible={setvisible}
        comment={commentPop}
        likePress={likePress}
        createdUserId={state.createdUserId}
        ref={commentsPopRef}
        deleteCommentData={deleteCommentData}
      ></CommentsPop>
    </div>
  );
};
export default Notifications;
