/*
 * @Author: lmk
 * @Date: 2021-08-12 22:28:09
 * @LastEditTime: 2022-01-21 18:44:04
 * @LastEditors: lmk
 * @Description:
 */
import Link from "@/view/Follows/Link";
import UserHeader from "@/view/Follows/UserHeader";
import React from "react";
import PostsIcons from "../PostsIcons";
import "@/styles/followPage.scss";
import ImageList from "../ImageList";
import { objToUrl } from "@/utils";
// import LazyLoad from 'react-lazyload';
// import ImageList from '../ImageList';
const PostItem = ({
  val = {
    user:{}
  },
  index,
  history,
  changeFollow,
  setLike,
  btnType,
  deleteItem,
  type,
}) => {
  const goDetail = (item) => {
    type !== "detail" &&
      history.push({ pathname: "/post", search: objToUrl({ id: item.id })});
  };
  const forwardDetail = (e, item) => {
    e.stopPropagation();
    history.push({ pathname: "/post", search: objToUrl({ id: item.id }) });
  };
  const forwardPress = () => {
    const id = val.parent_status ? val.parent_status.id : val.id;
    history.push({ pathname: "/forward", search: objToUrl({ id }) });
  };
  const commentPage = e => {
    e.stopPropagation();
    history.push({ pathname: "/comment", search: objToUrl({ id: val.id,createdUserId:val.user.uid }) });
  };
  return val&&(
    <div
      key={index}
      className="m-padding15 m-bg-fff m-line-bottom"
      onClick={() => goDetail(val)}
    >
      <UserHeader
        item={{
          ...val.user,
          is_public: val.is_public,
          from_type: val.from_type,
          created_at: val.created_at,
        }}
        followed={() => changeFollow(val)}
        btnType={btnType}
        deleteItem={deleteItem}
      />

      {val.content && (
        <p
          className={`itemContent  ${
            type !== "detail"
              ? "item-eli m-font15 m-margin-tb8"
              : "m-font18 m-margin-tb12 detail-content"
          }`}
        >
          {val.content}
        </p>
      )}

      {!val.content && <div className="emptyContent"></div>}

      {val.status_type === "link" && (
        <Link type={type} theme="primary" item={val.link_meta}></Link>
      )}
      {val.parent_status && (
        <div
          className="m-bg-f8f8f8 m-padding10 border-radius5"
          onClick={(e) => forwardDetail(e, val.parent_status)}
        >
          <UserHeader
            item={{
              ...val.parent_status.user,
              is_public: val.parent_status.is_public,
              from_type: val.parent_status.from_type,
              created_at: val.parent_status.created_at,
            }}
            size={30}
            followed={() => changeFollow(val, !!val.parent_status)}
          />
          {val.parent_status.content && (
            <p className="itemContent m-font13 m-margin-tb5">
              {val.parent_status.content}
            </p>
          )}
          {!val.parent_status.content && (
            <div className="m-margin-bottom10"></div>
          )}
          {val.parent_status.status_type === "link" && (
            <Link theme="white" item={val.parent_status.link_meta} />
          )}
          {val.parent_status.status_type === "image" && (
            <ImageList list={val.parent_status.images} boxWidth={window.innerWidth - 20}></ImageList>
          )}
          
          <p className="forwardPostsData">
            like {val.parent_status.likes_count} · comment{" "}
            {val.parent_status.comments_count} · foward{" "}
            {val.parent_status.forwards_count}
          </p>
        </div>
      )}
      {val.status_type === "image" && (
        <ImageList list={val.images}></ImageList>
      )}
      <PostsIcons
        likeCallback={() => setLike(val)}
        commentPage={commentPage}
        item={val}
        type={type} 
        forwardCallback={() => forwardPress(val)}
      />
    </div>
  );
};
export default PostItem;
