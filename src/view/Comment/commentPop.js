/*
 * @Author: lmk
 * @Date: 2022-01-10 16:23:16
 * @LastEditTime: 2022-01-13 10:37:54
 * @LastEditors: lmk
 * @Description:
 */
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import "./index.scss";
import replies_close from "@/images/replies_close.png";
import replies_refresh from "@/images/replies_refresh.png";
import { Popup } from "zarm";
import Image from "@/components/Image";
import { formatTimeStr, useList, username, useRouteState } from "@/utils";
import liked from "@/images/liked.png";
import like from "@/images/like.png";
import { getComment } from "@/api/status";
import PullList from "@/components/PullList";
const CommentsPop = ({
  setvisible,
  visible,
  comment: data,
  replyItem,
  likePress
},ref) => {
  // const [data, setdata] = useState({
  //   user: {},
  //   comments:[]
  // });
  const state = useRouteState();
  const [lastId, setlastId] = useState("");
  const [fetchData, last_id, dataSource, setdataSource] = useList(getComment, {
    status_id: state.id,
    topic_id: data.id,
    limit: 20,
    last_id: lastId,
  });
  useEffect(() => {
    setlastId(last_id);
  }, [last_id]);
  useImperativeHandle(ref, () => {
    return {
      // update datalist
      setData(res) {
        dataSource.unshift(res);
        setdataSource([...dataSource])
      }
    }
  })
  useEffect(() => {
    return () => {
      if (visible) {
        setdataSource([]);
        setlastId("");
      }
    };
    // eslint-disable-next-line
  }, [visible]);
  const { avatar = {} } = data.user || {};
  const renderView = (val, index) => {
    return (
      <div
        className="m-flex m-col-top m-padding-top13 m-padding-left15 child-comment"
        key={index}
        onClick={() => replyItem(val)}
      >
        <Image size={30} source={avatar&&avatar.medium}></Image>
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
              <span className="m-colors-666 m-font12">{formatTimeStr(val.created_at)}</span>
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
        <Image size={30} source={avatar&&avatar.medium}></Image>
        <div className="m-margin-left11 m-line-bottom m-flex-1">
          <span className="commentNickname">{username(data.user)}</span>
          <div className="m-font15 m-colors-555 m-margin-top8   m-padding-bottom13">
            <p className="comment-content">{data.content}</p>
            <div className="m-flex m-row-between m-margin-top8">
              <span className="m-colors-666 m-font12">{formatTimeStr(data.created_at)}</span>
              <div className="right-icon m-flex">
                <div
                  className="m-flex like-box"
                  onClick={(e) => likePress(e, data)}
                >
                  <img
                    src={data.is_liked ? liked : like}
                    className="icon"
                    alt="like"
                  ></img>
                  <span
                    className={`m-font14 m-margin-left8 ${
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
  const [setrefreshFlag,setrefresh] = useState(false)
  const refresh = ()=>{
    if(!setrefreshFlag){
      fetchData('refresh')
      setrefresh(true)
      setTimeout(() => setrefresh(false), 2500);
    }
  }
  return (
    <Popup
      visible={visible}
      onMaskClick={() => setvisible(false)}
      direction="bottom"
      mountContainer={() => document.body}
    >
      <div>
        <div className="title-box m-flex">
          <div className={`pop-icon refresh ${setrefreshFlag ? 'refresh-active':''}`} onClick={refresh}>
            <img src={replies_refresh} alt="" width={18} />
          </div>
          <div className="m-flex-1 pop-title">
            {data.comments_count} Replies
          </div>
          <div className="pop-icon" onClick={() => setvisible(false)}>
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
      </div>
    </Popup>
  );
};
export default forwardRef(CommentsPop);
