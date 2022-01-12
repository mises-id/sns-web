/*
 * @Author: lmk
 * @Date: 2021-07-15 16:07:01
 * @LastEditTime: 2022-01-10 17:58:44
 * @LastEditors: lmk
 * @Description: comment
 */

import "./index.scss";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Toast } from "zarm";
import PullList from "@/components/PullList";
import Navbar from "@/components/NavBar";
import { useBind, useList, username, useRouteState } from "@/utils";
import { getComment } from "@/api/status";
import { createComment, likeComment, unlikeComment } from "@/api/comment";
import { useSelector } from "react-redux";
import liked from '@/images/liked.png'
import like from '@/images/like.png'
import commentIcon from '@/images/comment.png'
import ReplyInput from "@/components/ReplyInput";
import Image from "@/components/Image";
import CommentsPop from "./commentPop";

const Comment = ({ history }) => {
  const { t } = useTranslation();
  const state = useRouteState();
  const [selectItem, setselectItem] = useState({})
  const input = useRef();
  const likePress = (e,val)=>{
    e.stopPropagation()
    const fn = val.is_liked ? unlikeComment : likeComment;
    fn(val.id).then(res=>{
      val.is_liked = !val.is_liked;
      const findIndex = dataSource.findIndex(item=>item.id===val.id);
      val.likes_count = val.is_liked ? ++val.likes_count : --val.likes_count
      if(findIndex>-1){
        dataSource[findIndex] = val;
        console.log(dataSource)
        setdataSource([...dataSource])
      }
    }).catch(res=>{
      
    })
  }
  const replyItem = val=>{
    commentContent.onChange('')
    val.username = username(val.user)
    setselectItem(val)
    input.current.focus()
  }
  const renderView = (val = {}, index) => {
    const {user = {},comments=[]} = val;
    const {avatar={}} = user;
    return (
      <div
        key={index}
        className="m-flex m-col-top m-padding-top13 m-bg-fff m-padding-left15"
        onClick={()=>replyItem(val)}
      >
        <Image
          size={30}
          source={avatar.medium}
        ></Image>
        <div className="m-margin-left11 m-line-bottom m-flex-1">
          <span className="commentNickname">
            {username(user)}
          </span>
          <div className="m-font15 m-colors-555 m-margin-top8 right-content  m-padding-bottom13">
            <p className="comment-content">{val.content}</p>
            <div className="m-flex m-row-between m-margin-top8">
              <span className="m-colors-666 m-font12">15:43</span>
              <div className="right-icon m-flex">
                <div className="m-flex like-box"  onClick={(e)=>likePress(e,val)}>
                  <img src={val.is_liked ? liked : like}  className='icon' alt="like"></img>
                  <span className={`m-font14 m-margin-left8 ${val.is_liked ? 'm-colors-FF3D62' : 'm-colors-333'}`}>{val.likes_count || 0}</span>
                </div>
                <div className="m-flex icon-box">
                  <img src={commentIcon}  className='icon' alt="comment"></img>
                  <span className={`m-font14 m-colors-333 m-margin-left8`}>{val.comments_count || 0}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="all-comment">
            {comments.map((item,i)=>{
              const {user={},content} = item;
              const {avatar={}} = user;
              return <div
                  key={i}
                  className="m-flex m-col-top m-bg-fff m-padding-bottom15"
                  onClick={()=>replyItem(item)}
                >
                  <Image
                    size={20}
                    source={avatar.medium}
                  ></Image>
                  <div className="m-margin-left11 m-flex-1">
                    <div className="m-flex m-padding-bottom10">
                      <span className="commentNickname1">{username(user)}{item.opponent&&<span className="at-name">@{item.opponent.username}</span>}:</span>
                      <p className="comment-content1">{content}</p>
                    </div>
                    <span className="m-colors-666 m-font12">15:43</span>
                  </div>
                </div>
            })}
            {val.comments_count>3&&<p className="more-comment-list" onClick={(e)=>showMoreComment(e,val.id)}>View all {val.comments_count - comments.length} comments</p>}
          </div>
        </div>
      </div>
    );
  };
  //getData
  const [lastId, setlastId] = useState("");
  const [fetchData, last_id, dataSource, setdataSource] = useList(getComment, {
    status_id: state.id,
    limit: 20,
    last_id: lastId,
  });
  const user = useSelector((state) => state.user) || {};
  const [loading, setloading] = useState(false);
  useEffect(() => {
    setlastId(last_id);
  }, [last_id]);
  const commentContent = useBind("");
  const submit = (e) => {
    e.preventDefault();
    if (!user.token) {
      Toast.show(t("notLogin"));
      return false;
    }
    if (loading || !commentContent.value) {
      return false;
    }
    setloading(true);
    createComment({
      content: commentContent.value,
      status_id: state.id,
      parent_id:selectItem.id || '',
    })
      .then((res) => {
        if(selectItem.content){ // if has select item
          if(selectItem.comments_count<3){
            selectItem.comments.push(res);
            const findIndex = dataSource.findIndex(val=>val.id===selectItem.id)
            if(findIndex>-1){
              dataSource[findIndex] = selectItem;
            }
          }
          selectItem.comments_count+=1;
          setselectItem('')
        }else{
          dataSource.unshift(res);
        }
        setdataSource([...dataSource]);
        commentContent.onChange("");
      })
      .finally(() => {
        setloading(false);
      });
  };
  const [visible, setvisible] = useState(false)
  const [commentId, setcommentId] = useState('')
  const showMoreComment = (e,id)=>{
    e.stopPropagation()
    setvisible(true)
    setcommentId(id)
  }
  return (
    <div className="m-flex m-flex-col page">
      <Navbar
        title={
          t("commentPageTitle") +
          (dataSource.length ? `(${dataSource.length})` : "")
        }
      />
      <div className="m-flex-1 commentBox">
        <PullList
          renderView={renderView}
          data={dataSource}
          load={fetchData}
        ></PullList>
      </div>
      <CommentsPop visible={visible} setvisible={setvisible} commentId={commentId} replyItem={replyItem}></CommentsPop>
      <ReplyInput ref={input} submit={submit} content={commentContent} placeholder={selectItem&&selectItem.username ? `@${selectItem.username}` : ''}></ReplyInput>
    </div>
  );
};
export default Comment;
