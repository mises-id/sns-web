/*
 * @Author: lmk
 * @Date: 2021-07-15 23:43:29
 * @LastEditTime: 2022-01-24 16:34:26
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
import Image from "@/components/Image";
import like from "@/images/like.png";
import CommentsPop from "@/view/Comment/commentPop";
import {
  getNotificationList,
  uploadNotificationState,
} from "@/api/notifications";
import { useDispatch, useSelector } from "react-redux";
import { setFollowingBadge } from "@/actions/user";
import { useRef } from "react";
import { getCommentId, likeComment, removeComment, unlikeComment } from "@/api/comment";
import { Modal } from "zarm";
import { dropByCacheKey, useDidRecover } from "react-router-cache-route";
const Notifications = ({ history }) => {
  const [lastId, setlastId] = useState("");
  const state = useRouteState();
  const selector = useSelector((state) => state.user) || {};
  const [fetchData, last_id, dataSource] = useList(getNotificationList, {
    last_id: lastId,
    limit: state.count || 20,
  });
  //getData
  const [isseting, setisseting] = useState(false);
  const dispatch = useDispatch(null);
  useEffect(() => {
    setlastId(last_id);
    if (!isseting) {
      const getUnReadArr = dataSource.filter((val) => val.state === "unread");
      if (getUnReadArr.length > 0) {
        const ids = getUnReadArr.map((val) => val.id);
        uploadNotificationState({ ids })
          .then((res) => {
            dispatch(
              setFollowingBadge({
                total: selector.badge.total - ids.length,
                notifications_count: 0,
              })
            );
          })
          .catch((error) => {});
        setisseting(true);
      }
    }
  }, [dataSource.length]); // eslint-disable-line react-hooks/exhaustive-deps
  // const createPosts = () => history.push({ pathname: "/createPosts" });
  const { t } = useTranslation();
  const commentsPopRef = useRef();
  const goDetail = ({ status}) => {
    status&&history.push({
      pathname: "/post",
      search: objToUrl({ id: status.id }),
    });
  };
  const detail = async val => {
    const { status,message_type,user,meta_data,created_at } = val
    if(!['new_comment','new_like_comment'].includes(message_type)){
      goDetail(val)
    }else{
      if(!status) return false;
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
    const avatar = user.avatar ? user.avatar.medium : "";
    return (
      <div
        className="item m-flex m-line-bottom"
        key={index}
        onClick={() => detail(val)}
      >
        <Image size={40} source={avatar}></Image>
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
  const rightView = ({ status,meta_data={},message_type}) => {
    const image = status&&message_type!=='new_like_comment'&&returnImage(status)
    return status&&(
      <div className="right-view">
        {image&&<Image
          size={60}
          alt="image"
          shape="square"
          borderRadius="3px"
          source={image}
        ></Image>}
        {status.status_type === "text"&&!image&&<div>
          <p className="post-content item-eli">{meta_data.content_summary || meta_data.comment_content || meta_data.status_content_summary || meta_data.status_content}</p>
        </div>}
      </div>
    );
  };
  const returnImage = (status={})=>{
    switch (status.status_type) {
      case 'image':
        return status.thumb_images[0];
      case 'text':
        if(status.parent_status){
          if(status.parent_status.status_type==='image'){
            return status.parent_status.thumb_images[0];
          }
          if(status.parent_status.status_type==='link'){
            return status.parent_status.link_meta.attachment_url;
          }
        } 
        return ''
      default:
        return ''
    }
  }
  const notificationsType = (val) => {
    const metaData = val.meta_data;
    //type :new_comment, new_like, new_fans, new_forward
    switch (val.message_type) {
      case "new_like_status":
      case "new_like_comment":
        return (
          <div className="like-icon">
            <Image source={like} shape="square" size={16}></Image>
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
        const obj = {};
        if(metaData.parent_username.indexOf('did:mises')>-1){
          obj.misesid = metaData.parent_username
        }else{
          obj.username = metaData.parent_username
        }
        return (
          <div>
            {metaData.content && (
              <p className="item-content">{metaData.content}</p>
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
        load={fetchData}
      ></PullList>
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
