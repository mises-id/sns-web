/*
 * @Author: lmk
 * @Date: 2022-01-10 16:23:16
 * @LastEditTime: 2022-01-10 17:41:59
 * @LastEditors: lmk
 * @Description:
 */
import React, { useEffect, useState } from "react";
import "./index.scss";
import replies_close from "@/images/replies_close.png";
import replies_refresh from "@/images/replies_refresh.png";
import { Popup } from "zarm";
import Image from "@/components/Image";
import { username } from "@/utils";
import liked from "@/images/liked.png";
import like from "@/images/like.png";
import { likeComment, unlikeComment } from "@/api/comment";
const CommentsPop = ({ setvisible, visible, commentId,replyItem }) => {
  const [data, setdata] = useState({
    user: {},
    comments:[]
  });
  useEffect(() => {
    commentId && getData();
  }, [commentId]);
  const getData = () => {
    setdata({
      id: "61dbcc8310a265637a72a2e6",
      topic_id: "",
      content: "22222",
      comments: [
        {
          id: "61dbcbcc10a265637a72a2e5",
          topic_id: "61dbcaf010a265637a72a2e4",
          content: "1111",
          comments: [],
          comments_count: 0,
          likes_count: 0,
          user: {
            uid: 52,
            username: "ddd12",
            misesid: "mises",
            avatar: {
              small:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
              medium:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
              large:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
            },
            is_followed: false,
          },
          opponent: {
            uid: 52,
            username: "ddd12",
            misesid: "mises",
            avatar: {
              small:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
              medium:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
              large:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
            },
            is_followed: false,
          },
        },
        {
          id: "61dbe20edb70f5a0eb8a975a",
          topic_id: "61dbcaf010a265637a72a2e4",
          content: "缺少根据主评论id获取子评论列表的接口",
          comments: [],
          comments_count: 0,
          likes_count: 0,
          user: {
            uid: 52,
            username: "ddd12",
            misesid: "mises",
            avatar: {
              small:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
              medium:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
              large:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
            },
            is_followed: false,
          },
          opponent: {
            uid: 52,
            username: "ddd12",
            misesid: "mises",
            avatar: {
              small:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
              medium:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
              large:
                "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
            },
            is_followed: false,
          },
        },
      ],
      comments_count: 0,
      likes_count: 0,
      user: {
        uid: 52,
        username: "ddd12",
        misesid: "mises",
        avatar: {
          small:
            "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
          medium:
            "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
          large:
            "http://e1.mises.site/s3://mises-storage/upload/2022/01/10/1641789631411229.png?A2Ir3W75hKNrcYAMdq9hMm_TcdqmGadTUV6RBsCJ1QE",
        },
        is_followed: false,
      },
    });
  };

  const likePress = (e, val) => {
    e.stopPropagation();
    const fn = val.is_liked ? unlikeComment : likeComment;
    fn(val.id)
      .then((res) => {
        val.is_liked = !val.is_liked;
        val.likes_count = val.is_liked ? ++val.likes_count : --val.likes_count;
        setdata({ ...val });
      })
      .catch((res) => {});
  };
  const { avatar = {} } = data.user;
  return (
    <Popup
      visible={visible}
      onMaskClick={() => setvisible(false)}
      direction="bottom"
      mountContainer={() => document.body}
    >
      <div>
        <div className="title-box m-flex">
          <div className="icon" onClick={getData}>
            <img src={replies_refresh} alt="" width={18} />
          </div>
          <div className="m-flex-1 pop-title">
            {data.comments && data.comments.length} Replies
          </div>
          <div className="icon" onClick={() => setvisible(false)}>
            <img src={replies_close} alt="" width={18} />
          </div>
        </div>
        <div className="pop-content-scroll">
          <div className="m-flex m-col-top m-padding-top13 m-bg-fff m-padding-left15" onClick={()=>replyItem(data)}>
            <Image size={30} source={avatar.medium}></Image>
            <div className="m-margin-left11 m-line-bottom m-flex-1">
              <span className="commentNickname">{username(data.user)}</span>
              <div className="m-font15 m-colors-555 m-margin-top8   m-padding-bottom13">
                <p className="comment-content">{data.content}</p>
                <div className="m-flex m-row-between m-margin-top8">
                  <span className="m-colors-666 m-font12">15:43</span>
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
          <div className="more-comments">
            {data.comments.map((val, index) => {
              return (
                <div className="m-flex m-col-top m-padding-top13 m-padding-left15" key={index}  onClick={()=>replyItem(val)}>
                  <Image size={30} source={avatar.medium}></Image>
                  <div className="m-margin-left11 m-line-bottom m-flex-1">
                    <span className="commentNickname">{username(val.user)}</span>
                    <div className="m-font15 m-colors-555 m-margin-top8 right-content  m-padding-bottom13">
                      <div className="comment-content">{val.opponent&&<>Reply to <span className="at-name">@{val.opponent.username}</span></>}:{val.content}</div>
                      <div className="m-flex m-row-between m-margin-top8">
                        <span className="m-colors-666 m-font12">15:43</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </Popup>
  );
};
export default CommentsPop;
