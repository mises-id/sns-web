/*
 * @Author: lmk
 * @Date: 2021-07-15 14:48:08
 * @LastEditTime: 2022-01-28 21:38:41
 * @LastEditors: lmk
 * @Description: post detail
 */
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Loading, Modal } from "zarm";
import look from "@/images/look.png";
import "./index.scss";
import liked from "@/images/liked.png";
import like from "@/images/like.png";
import deleteComment from "@/images/deleteComment.png";
import commentIcon from "@/images/comment.png";
import Navbar from "@/components/NavBar";
import { getComment, getStatusItem } from "@/api/status";
import {
  formatTimeStr,
  isMe,
  objToUrl,
  useBind,
  useChangePosts,
  useLoginModal,
  username,
  useRouteState,
} from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { createComment, likeComment, removeComment, unlikeComment } from "@/api/comment";
import PostItem from "@/components/PostItem";
import ReplyInput from "@/components/ReplyInput";
import CommentsPop from "../Comment/commentPop";
import Image from "@/components/Image";
import { dropByCacheKey, useDidRecover } from "react-router-cache-route";
import { setUserSetting } from "@/actions/user";
const Post = ({ history = {} }) => {
  const { t } = useTranslation();
  const [item, setitem] = useState(""); // post data 
  const user = useSelector((state) => state.user) || {}; // userinfo 
  const [loading, setloading] = useState(false); // loading flag
  const { setLike, followPress } = useChangePosts(setitem, item); // like and follow function hooks

  const [selectItem, setselectItem] = useState({}); // select comment user
  const input = useRef();
  // like function 
  const likeFn = val=>{
    const fn = val.is_liked ? unlikeComment : likeComment;
    fn(val.id)
      .then((res) => {
        val.is_liked = !val.is_liked;
        const findIndex = comment.findIndex((item) => item.id === val.id);
        val.likes_count = val.is_liked ? ++val.likes_count : --val.likes_count;
        if (findIndex > -1) {
          comment[findIndex] = val;
          setcomment([...comment]);
        }
      })
      .catch((res) => {});
  }
  // click like icon button
  const likePress = (e, val) => {
    e.stopPropagation();
    if (!user.token) {
      loginModal(()=>{
        selectReplyItem(()=>likeFn(val))
      })
      return false;
    }
    likeFn(val)
  };
  // click comment user
  const selectReplyItem = val=>{
    commentContent.onChange('')
    val.username = username(val.user)
    setselectItem(val);
    input.current && input.current.focus();
  }
  // commit reply
  const replyItem = (val) => {
    if (!user.token) {
      loginModal(()=>{
        selectReplyItem(val)
      })
      return false;
    }
    selectReplyItem(val)
  };
  // get more comment
  const goComment = () => {
    history.push({ pathname: "/comment", search: objToUrl({ id,createdUserId:item.user.uid,count:item.comments_count }) });
  };
  // get this post detail 
  const getDetail = async (id) => {
    const res = await getStatusItem(id)
    setitem(res);
    Loading.hide();
    return res;
  };
  // get this post three comment  data
  const [comment, setcomment] = useState([]);
  const [showMore, setshowMore] = useState(false);
  const getCommentList = (id) => {
    getComment({ status_id: id, limit: 3 }).then((res) => {
      setcomment(res.data);
      setshowMore(!!res.pagination.last_id);
    });
  };
  const [id, setid] = useState("");
  const commentContent = useBind("");
  const state = useRouteState();
  // start loading 
  useEffect(() => {
    if (state) {
      // const historyState = urlToJson(location.search);
      Loading.show();
      setid(state.id);
      getDetail(state.id);
      getCommentList(state.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.id]);
  const loginModal = useLoginModal()
  const commitReply = async ()=>{
    if (loading || !commentContent.value) {
      return false;
    }
    setloading(true);
    try {
      const res = await createComment({
        content: commentContent.value,
        status_id: id,
        parent_id:selectItem.id || '',
      })
      if(selectItem.content){ // if has select item
        const findTopic = comment.find(val=>val.id===(selectItem.topic_id || selectItem.id)) // find top comment
        if(findTopic.comments_count<3){
          findTopic.comments.push(res);
        }
        findTopic.comments_count+=1;
        const findIndex = comment.findIndex(val=>val.id===findTopic.id)
        if(findIndex>-1){
          comment[findIndex] = findTopic;
        }
        setselectItem('')
      }else{
        comment.unshift(res);
      }
      setcomment(comment.slice(0, 3));
      comment.length > 3 && setshowMore(true);
      commentContent.onChange("");
      setloading(false);
      const postItem = await getDetail(state.id);
      uploadPostDataList(state.id,postItem.comments_count,'comment');
    } catch (error) {
      setloading(false);
    }
  }
  const submit = (e) => {
    e.preventDefault();
    commitReply()
  };

  const [visible, setvisible] = useState(false);
  const [commentPop, setcommentPop] = useState({})
  const showMoreComment = (e,val)=>{
    e.stopPropagation()
    setvisible(true)
    setcommentPop(val)
    val.username = username(val.user)
    setselectItem(val)
  }
  const commentsPopRef = useRef();
  const deleteCommentData = (e,val)=>{
    e.stopPropagation()
    Modal.confirm({
      title: 'Message',
      width:'90%',
      content: 'Are you sure to delete this comment?',
      onCancel: () => {
      },
      onOk: () => {
        removeComment(val.id).then(res=>{
          getCommentList(state.id);
          if(visible){  // If the pop is displayed and the first level comment is deleted
            if(!val.topic_id){ // top comment
              setvisible(false)
              setcommentPop({})
              return false;
            }
            if(val.topic_id){ // next comment
              commentsPopRef.current.removeItem(val.id)
            }
          }
          const findItemIndex = comment.findIndex(item=>item.id===(val.topic_id || val.id));
          if(val.topic_id){
            const findChildIndex = comment[findItemIndex].comments.findIndex(item=>item.id===val.id);
            comment[findItemIndex].comments.splice(findChildIndex,1)
            comment[findItemIndex].comments_count-=1
          }
          if(!val.topic_id){
            comment.splice(findItemIndex,1)
            
          }
          item.comments_count-=1
          setitem({...item})
          // setcomment([...comment])
          uploadPostDataList(state.id,item.comments_count,'comment')

        }).catch(error=>{
          console.log(error,23213);
        })
      },
    });
  }
  const dispatch = useDispatch()
  /**
   * @description: upload global list 
   * @param {string} upload postId
   * @param {string} upload data 
   * @param {string} actionType
   * @return {*}
   */
  const uploadPostDataList = (postId,data,type)=>{
    dispatch(setUserSetting({
      postId,
      data,
      actionType: type
    }))
  }
  const userDetail = (e,{user:item})=>{
    e.stopPropagation();
    const isMe = user.loginForm.uid === item.uid;
    if (!isMe) {
      const avatar = item.avatar ? item.avatar.medium : "";
      history.push({
        pathname: "/userDetail",
        search: objToUrl({ uid: item.uid, username: item.username, avatar,is_followed: item.is_followed,misesid:item.misesid }),
      });
    }
  }
  useDidRecover(()=>{
    dropByCacheKey('/comment')
  })
  return (
    <div className="post-detail">
      <Navbar title={t("postPageTitle")} />
      {item && (
        <div className="m-layout">
          <div className="m-bg-fff">
            <PostItem
              val={item}
              history={history}
              type="detail"
              changeFollow={followPress}
              setLike={setLike}
            />
          </div>
          {comment.length > 0 && (
            <div className="m-margin-top10 m-bg-fff m-padding15">
              {comment.map((val, index) => {
                const { comments = [] } = val;
                return (
                  <div
                    key={index}
                    className="m-flex m-col-top m-padding-top13 m-bg-fff"
                    onClick={() => replyItem(val)}>
                    <Image
                      size={30}
                      onClick={(e)=>userDetail(e,val)}
                      source={val.user.avatar ? val.user.avatar.medium : ""}
                    ></Image>
                    <div className="m-margin-left11 m-line-bottom m-flex-1">
                      <span className="commentNickname">
                        {username(val.user)}
                      </span>
                      <div className="m-font15 m-colors-555 m-margin-top8  m-padding-bottom13">
                        <p>{val.content}</p>
                        <div className="m-flex m-row-between m-margin-top8">
                          <div className="m-flex m-row-center">
                            <span className="m-colors-666 m-font12 m-margin-right8">{formatTimeStr((val.created_at))}</span>
                            {isMe(val.user,item.user.uid)&&<img src={deleteComment} alt="" width={12} onClick={e=>deleteCommentData(e,val)}/>}
                          </div>
                          <div className="right-icon m-flex">
                            <div
                              className="m-flex like-box"
                              onClick={(e) => likePress(e, val)}
                            >
                              <img
                                src={val.is_liked ? liked : like}
                                alt="like"
                                width={13}
                              ></img>
                              <span
                                className={`m-font11 m-margin-left8 ${
                                  val.is_liked
                                    ? "m-colors-FF3D62"
                                    : "m-colors-333"
                                }`}
                              >
                                {val.likes_count || 0}
                              </span>
                            </div>
                            <div className="m-flex icon-box">
                              <img
                                src={commentIcon}
                                alt="comment"
                                width={13}
                              ></img>
                              <span
                                className={`m-font11 m-colors-333 m-margin-left8`}
                              >
                                {val.comments_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="all-comment">
                        {comments.map((item, i) => {
                          const { user = {}, content, created_at} = item;
                          const { avatar = {} } = user;
                          return (
                            <div
                              key={i}
                              className="m-flex m-col-top m-bg-fff m-padding-bottom15"
                              onClick={e => {
                                e.stopPropagation()
                                replyItem(item)
                              }}
                            >
                              <Image size={20} source={avatar&&avatar.medium} onClick={(e)=>userDetail(e,val)}></Image>
                              <div className="m-margin-left11 m-flex-1">
                                <div className="m-padding-bottom10">
                                  <span className="commentNickname1">
                                    {username(user)}{item.opponent&&<span className="at-name">@{username(item.opponent)}</span>}:
                                  </span>
                                  <span className="comment-content1">{content}</span>
                                </div>
                                <div>
                                  <span className="m-colors-666 m-font12 m-margin-right8">{formatTimeStr(created_at)}</span>
                                  {isMe(user,item.user.uid)&&<img src={deleteComment} alt="" width={12} onClick={e=>deleteCommentData(e,item)}/>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {val.comments_count > 3 && (
                          <p
                            className="more-comment-list"
                            onClick={(e) => showMoreComment(e,val)}
                          >
                            View all {val.comments_count - comments.length}{" "}
                            comments
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {showMore ? (
                <div className="footerBtn">
                  <Button
                    shape="round"
                    size="sm"
                    theme="primary"
                    ghost
                    block
                    onClick={goComment}
                  >
                    <div className="m-flex m-row-center">
                      {t("lookAtAll")}
                      <img src={look} alt="look" className="look"></img>
                    </div>
                  </Button>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      )}
      <CommentsPop
        visible={visible}
        setvisible={setvisible}
        comment={commentPop}
        replyItem={replyItem}
        setParentSelectItem={setselectItem}
        inputContent={commentContent}
        likePress={likePress}
        createdUserId={item.user ? item.user.uid : ''}
        deleteCommentData={deleteCommentData}
        submit={submit}
        ref={commentsPopRef}
      ></CommentsPop>
      {item&&<ReplyInput
        submit={submit}
        content={commentContent}
        ref={input}
        setselectItem={setselectItem}
        placeholder={
          selectItem && selectItem.username ? `@${selectItem.username}` : ""
        }
      ></ReplyInput>}
    </div>
  );
};
export default Post;
