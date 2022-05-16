/*
 * @Author: lmk
 * @Date: 2021-07-15 14:48:08
 * @LastEditTime: 2022-05-13 09:34:35
 * @LastEditors: lmk
 * @Description: post detail
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {  Loading } from "zarm";
import "./index.scss";
import Navbar from "@/components/NavBar";
import {getStatusItem } from "@/api/status";
import {
  useChangePosts,
  useRouteState,
} from "@/utils";
import { dropByCacheKey, useDidRecover } from "react-router-cache-route";
import Empty from "@/components/Empty";
import PostItem from "@/components/PostItem";
import { CommentView } from "./CommentView";
const Post = ({ history = {} }) => {
  const { t } = useTranslation();
  const [item, setitem] = useState(""); // post data 
  const { setLike, followPress } = useChangePosts(setitem, item); // like and follow function hooks
  const state = useRouteState();
  // get this post three comment  data
  const [notFound, setnotFound] = useState(false)
  // start loading 
  useEffect(() => {
    if (state) {
      // const historyState = urlToJson(location.search);
      Loading.show();
      getDetail(state.id);
      if(state.misesid){
        sessionStorage.setItem('referrer',state.misesid)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.id]);
  // like function 
  // get this post detail 
  const getDetail = async (id) => {
    try {
      const res = await getStatusItem(id)
      setitem(res);
      window.$misesShare = {
        url:window.location.href,
        images:res.thumb_images&&res.thumb_images[0] ? res.thumb_images[0] : 'https://home.mises.site/logo192.png'
      };
      Loading.hide();
      return res;
    } catch (error) {
      Loading.hide();
      setnotFound(true)
      console.log(error)
    }
  };
  useDidRecover(()=>{
    dropByCacheKey('/comment')
  })
  useEffect(() => {
    return () => {
      window.$misesShare = ''
    }
  }, [])
  
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
          <CommentView item={item} setitem={setitem} refresh={getDetail}/>
        </div>
      )}
      {notFound && (<Empty />)}
    </div>
  );
};
export default Post;
