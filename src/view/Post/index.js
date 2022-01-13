/*
 * @Author: lmk
 * @Date: 2021-07-15 14:48:08
 * @LastEditTime: 2022-01-13 10:30:42
 * @LastEditors: lmk
 * @Description: post detail
 */
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Toast, Loading } from "zarm";
import look from "@/images/look.png";
import "./index.scss";
import liked from "@/images/liked.png";
import like from "@/images/like.png";
import commentIcon from "@/images/comment.png";
import Navbar from "@/components/NavBar";
import { getComment, getStatusItem } from "@/api/status";
import {
  formatTimeStr,
  objToUrl,
  useBind,
  useChangePosts,
  username,
  useRouteState,
} from "@/utils";
import { useSelector } from "react-redux";
import { createComment, likeComment, unlikeComment } from "@/api/comment";
import PostItem from "@/components/PostItem";
import ReplyInput from "@/components/ReplyInput";
import CommentsPop from "../Comment/commentPop";
import Image from "@/components/Image";
const Post = ({ history = {} }) => {
  const { t } = useTranslation();
  const [item, setitem] = useState("");
  const user = useSelector((state) => state.user) || {};
  const [loading, setloading] = useState(false);
  const { setLike, followPress } = useChangePosts(setitem, item);

  const [selectItem, setselectItem] = useState({});
  const input = useRef();
  const likePress = (e, val) => {
    e.stopPropagation();
    const fn = val.is_liked ? unlikeComment : likeComment;
    fn(val.id)
      .then((res) => {
        val.is_liked = !val.is_liked;
        const findIndex = comment.findIndex((item) => item.id === val.id);
        val.likes_count = val.is_liked ? ++val.likes_count : --val.likes_count;
        if (findIndex > -1) {
          comment[findIndex] = val;
          console.log(comment);
          setcomment([...comment]);
        }
      })
      .catch((res) => {});
  };
  const replyItem = (val) => {
    commentContent.onChange('')
    val.username = username(val.user)
    setselectItem(val);
    input.current && input.current.focus();
  };
  const goComment = () => {
    history.push({ pathname: "/comment", search: objToUrl({ id }) });
  };
  const getDetail = (id) => {
    getStatusItem(id).then((res) => {
      setitem(res);
      Loading.hide();
    }).catch(()=>{
      Loading.hide();
    });
  };
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
  useEffect(() => {
    if (state) {
      // const historyState = urlToJson(location.search);
      Loading.show();
      setid(state.id);
      getDetail(state.id);
      getCommentList(state.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      status_id: id,
      parent_id:selectItem.id || '',
    })
      .then((res) => {
        if(selectItem.content){ // if has select item
          if(selectItem.comments_count<3){
            selectItem.comments.push(res);
            const findIndex = comment.findIndex(val=>val.id===selectItem.id)
            if(findIndex>-1){
              comment[findIndex] = selectItem;
            }
          }
          selectItem.comments_count+=1;
          setselectItem('')
        }else{
          comment.unshift(res);
        }
        setcomment(comment.slice(0, 3));
        comment.length > 3 && setshowMore(true);
        commentContent.onChange("");

      })
      .finally(() => {
        setloading(false);
      });
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
                      source={val.user.avatar ? val.user.avatar.medium : ""}
                    ></Image>
                    <div className="m-margin-left11 m-line-bottom m-flex-1">
                      <span className="commentNickname">
                        {username(val.user)}
                      </span>
                      <div className="m-font15 m-colors-555 m-margin-top8  m-padding-bottom13">
                        <p>{val.content}</p>
                        <div className="m-flex m-row-between m-margin-top8">
                          <span className="m-colors-666 m-font12">{formatTimeStr((val.created_at))}</span>
                          <div className="right-icon m-flex">
                            <div
                              className="m-flex like-box"
                              onClick={(e) => likePress(e, val)}
                            >
                              <img
                                src={val.is_liked ? liked : like}
                                className="icon"
                                alt="like"
                              ></img>
                              <span
                                className={`m-font14 m-margin-left8 ${
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
                                className="icon"
                                alt="comment"
                              ></img>
                              <span
                                className={`m-font14 m-colors-333 m-margin-left8`}
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
                              onClick={() => replyItem(item)}
                            >
                              <Image size={20} source={avatar&&avatar.medium}></Image>
                              <div className="m-margin-left11 m-flex-1">
                                <div className="m-padding-bottom10">
                                  <span className="commentNickname1">
                                    {username(user)}{item.opponent&&<span className="at-name">@{username(item.opponent)}</span>}:
                                  </span>
                                  <span className="comment-content1">{content}</span>
                                </div>
                                <span className="m-colors-666 m-font12">{formatTimeStr((created_at))}</span>
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
        likePress={likePress}
      ></CommentsPop>
      {item&&<ReplyInput
        submit={submit}
        content={commentContent}
        placeholder={
          selectItem && selectItem.username ? `@${selectItem.username}` : ""
        }
      ></ReplyInput>}
    </div>
  );
};
export default Post;
