/*
 * @Author: lmk
 * @Date: 2022-01-10 16:23:16
 * @LastEditTime: 2022-01-28 22:06:27
 * @LastEditors: lmk
 * @Description:
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import "./index.scss";
import replies_close from "@/images/replies_close.png";
import replies_refresh from "@/images/replies_refresh.png";
import { Popup } from "zarm";
import Image from "@/components/Image";
import {
  formatTimeStr,
  isMe,
  objToUrl,
  useBind,
  useList,
  useLoginModal,
  username,
  useRouteState,
} from "@/utils";
import liked from "@/images/liked.png";
import like from "@/images/like.png";
import { getComment } from "@/api/status";
import PullList from "@/components/PullList";
import deleteComment from "@/images/deleteComment.png";
import ReplyInput from "@/components/ReplyInput";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { createComment } from "@/api/comment";
import { useHistory } from "react-router-dom";
const CommentsPop = (
  {
    setvisible,
    visible,
    comment,
    likePress,
    createdUserId,
    deleteCommentData,
    submit,
    setParentSelectItem,
    inputContent,
  },
  ref
) => {
  // const [data, setdata] = useState({
  //   user: {},
  //   comments:[]
  // });
  const state = useRouteState();
  const [lastId, setlastId] = useState("");
  const status_id = state.id;
  const [data, setdata] = useState(comment);
  let [fetchData, last_id, dataSource, setdataSource] = useList(getComment, {
    status_id: state.id || comment.state_id,
    topic_id: comment.id,
    limit: 20,
    last_id: lastId,
  });
  useEffect(() => {
    setlastId(last_id);
  }, [last_id]);
  const [setTopCommentId, setsetTopCommentId] = useState('');
  useEffect(() => {
    setselectItem(comment);
    setdata(comment)
  }, [comment]);
  useImperativeHandle(ref, () => {
    return {
      // update datalist
      setData(res) {
        if(res){
          console.log(res);
          dataSource.unshift(res);
          setdataSource([...dataSource]);
        }
      },
      removeItem(valId){
        const valIndex = dataSource.findIndex(val=>val.id===valId)
        dataSource.splice(valIndex,1)
        dataSource.length===0 ? fetchData('refresh') : setdataSource([...dataSource])
      },
      setTopCommentId(id){
        setsetTopCommentId(id)
      }
    };
  });
  const [isSetTop, setisSetTop] = useState(false);
  useEffect(()=>{
    if(dataSource.length>0&&!isSetTop){
      const first = dataSource[0];
      const lastList = dataSource.slice(1);
      const findIndex = lastList.findIndex(val=>val.id===setTopCommentId);
      if(findIndex>-1){
        lastList.splice(findIndex,1);
        setisSetTop(true)
        // eslint-disable-next-line
        dataSource = [first,...lastList]
        setdataSource([...dataSource])
      }
    }
  },[dataSource.length])
  useEffect(() => {
    return () => {
      if (visible) {
        setdataSource([]);
        setlastId("");
      }
    };
    // eslint-disable-next-line
  }, [visible]);

  const selectReplyItem = (val) => {
    commentContent.onChange("");
    val.username = username(val.user);
    setselectItem(val);
    setParentSelectItem&&setParentSelectItem(val);
    input.current && input.current.focus();
  };
  const user = useSelector((state) => state.user) || {};
  const loginModal = useLoginModal();
  const replyItem = (val) => {
    if (!user.token) {
      loginModal(() => {
        selectReplyItem(val);
      });
      return false;
    }
    selectReplyItem(val);
  };
  const commentContent = useBind("");
  const input = useRef();
  const [selectItem, setselectItem] = useState(data);
  const { avatar = {} } = data.user || {};
  const history = useHistory()
  const userDetail = (e,{user:item})=>{
    e.stopPropagation();
    const isMe = user.loginForm.uid === item.uid;
    if (!isMe) {
      setvisible(false)
      setTimeout(() => {
        const avatar = item.avatar ? item.avatar.medium : "";
        history.push({
          pathname: "/userDetail",
          search: objToUrl({ uid: item.uid, username: item.username, avatar,is_followed: item.is_followed,misesid:item.misesid }),
        });
      }, 10);
    }
  }
  
  const renderView = (val, index) => {
    const valAvatar = val.user.avatar || {}
    return (
      <div
        className="m-flex m-col-top m-padding-top13 m-padding-left15 child-comment"
        key={index}
        onClick={() => replyItem(val)}
      >
        <Image size={30} source={valAvatar.medium} key={val.id} onClick={e=>userDetail(e,val)}></Image>
        <div className="m-margin-left11 m-line-bottom m-flex-1">
          <span className="commentNickname">{username(val.user)}</span>
          <div className="m-font15 m-colors-555 m-margin-top8 right-content  m-padding-bottom13">
            <div className="comment-content">
              {val.opponent && (
                <>
                  Reply to{" "}
                  <span className="at-name">@{username(val.opponent)}</span>:
                </>
              )}
              {val.content}
            </div>
            <div className="m-flex m-row-between m-margin-top8">
              <div className="m-flex m-row-center">
                <span className="m-colors-666 m-font12 m-margin-right8">
                  {formatTimeStr(val.created_at)}
                </span>
                {isMe(val.user, createdUserId) && (
                  <img
                    src={deleteComment}
                    alt=""
                    width={12}
                    onClick={(e) => deleteCommentData(e, val)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // parent comment
  const otherView = () => {
    return (
      <div
        className="m-flex m-col-top m-padding-top13 m-bg-fff m-padding-left15"
        onClick={() => replyItem(data)}
      >
        <Image size={30} source={avatar && avatar.medium} onClick={e=>userDetail(e,data)}></Image>
        <div className="m-margin-left11 m-line-bottom m-flex-1">
          <span className="commentNickname">{username(data.user)}</span>
          <div className="m-font15 m-colors-555 m-margin-top8   m-padding-bottom13">
            <p className="comment-content">{data.content}</p>
            <div className="m-flex m-row-between m-margin-top8">
              <div className="m-flex m-row-center">
                <span className="m-colors-666 m-font12 m-margin-right8">
                  {formatTimeStr(data.created_at)}
                </span>
                {isMe(data.user, createdUserId) && (
                  <img
                    src={deleteComment}
                    alt=""
                    width={12}
                    onClick={(e) => deleteCommentData(e, data)}
                  />
                )}
              </div>
              <div className="right-icon m-flex">
                <div
                  className="m-flex like-box"
                  onClick={(e) => likePress(e, data)}
                >
                  <img
                    src={data.is_liked ? liked : like}
                    width={13}
                    alt="like"
                  ></img>
                  <span
                    className={`m-font11 m-margin-left8 ${
                      data.is_liked ? "m-colors-FF3D62" : "m-colors-333"
                    }`}
                  >
                    {data.likes_count || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const [setrefreshFlag, setrefresh] = useState(false);
  const refresh = () => {
    if (!setrefreshFlag) {
      fetchData("refresh");
      setrefresh(true);
      setTimeout(() => setrefresh(false), 2500);
    }
  };
  const closePop = () => {
    setvisible(false);
    commentContent.onChange("");
    setselectItem("");
    setisSetTop(false)
  };
  const submitItem = (e) => {
    inputContent&&inputContent.onChange(commentContent.value);
    submit&&submit(e);
    createComment({
      content: commentContent.value,
      status_id: status_id  || comment.state_id,
      parent_id: selectItem.id || "",
    }).then((res) => {
      commentContent.onChange("");
      setselectItem(data);
      dataSource.unshift(res);
      setdataSource([...dataSource]);
      data.comments_count+=1
      setdata({...data})
    });
  };
  return (
    <Popup
      visible={visible}
      onMaskClick={closePop}
      direction="bottom"
      mountContainer={() => document.body}
    >
      <div>
        <div className="title-box m-flex">
          <div
            className={`pop-icon refresh ${
              setrefreshFlag ? "refresh-active" : ""
            }`}
            onClick={refresh}
          >
            <img src={replies_refresh} alt="" width={18} />
          </div>
          <div className="m-flex-1 pop-title">
            {data.comments_count} Replies
          </div>
          <div className="pop-icon" onClick={closePop}>
            <img src={replies_close} alt="" width={18} />
          </div>
        </div>
        <div className="pop-content-scroll">
          <PullList
            renderView={renderView}
            data={dataSource}
            otherView={otherView}
            load={fetchData}
          ></PullList>
        </div>
        <ReplyInput
          submit={submitItem}
          content={commentContent}
          ref={input}
          defaultItem={data}
          setselectItem={setselectItem}
          placeholder={
            selectItem && selectItem.username ? `@${selectItem.username}` : ""
          }
        ></ReplyInput>
      </div>
    </Popup>
  );
};
export default forwardRef(CommentsPop);
