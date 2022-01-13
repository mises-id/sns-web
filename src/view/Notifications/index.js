/*
 * @Author: lmk
 * @Date: 2021-07-15 23:43:29
 * @LastEditTime: 2022-01-13 10:23:18
 * @LastEditors: lmk
 * @Description: my post page
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/styles/followPage.scss";
import "./index.scss";
import PullList from "@/components/PullList";
import Navbar from "@/components/NavBar";
import { formatTimeStr, objToUrl, useList, username, useRouteState } from "@/utils";
import Image from "@/components/Image";
import like from "@/images/like.png";
import { getNotificationList, uploadNotificationState } from "@/api/notifications";
import { useDispatch, useSelector } from "react-redux";
import { setFollowingBadge } from "@/actions/user";
const Notifications = ({ history }) => {
  const [lastId, setlastId] = useState("");
  const state = useRouteState()
  const selector = useSelector((state) => state.user) || {};
  const [fetchData, last_id, dataSource] = useList(getNotificationList, {
    last_id: lastId,
    limit: state.count || 20,
  });
  //getData
  const [isseting, setisseting] = useState(false)
  const dispatch = useDispatch(null);
  useEffect(() => {
    setlastId(last_id);
    if(!isseting){
      const getUnReadArr = dataSource.filter(val=>val.state ==='unread');
      if(getUnReadArr.length>0){
        const ids = getUnReadArr.map(val=>val.id)
        uploadNotificationState({ids}).then(res=>{
          dispatch(setFollowingBadge({
            total:selector.badge.total - ids.length,
            notifications_count:0
          }))
        }).catch(error=>{
        })
        setisseting(true)
      }
    }
  }, [dataSource.length]); // eslint-disable-line react-hooks/exhaustive-deps
  // const createPosts = () => history.push({ pathname: "/createPosts" });
  const { t } = useTranslation();
  const detail = val=>{
    history.push({ pathname: "/post", search: objToUrl({ id: val.id })});
  }
  //render item
  const renderView = (val = {}, index) => {
    const user = val.user || {};
    const avatar = user.avatar ? user.avatar.medium : "";
    return (
      <div className="item m-flex m-line-bottom" key={index} onClick={()=>detail(val)}>
        <Image size={40} source={avatar}></Image>
        <div className="avatar-item m-flex-1">
          <p className="user-name m-colors-111">
            {username(user)}
          </p>
          {notificationsType(val)}
          <p className="time-view">{formatTimeStr(val.created_at)}</p>
        </div>
        {rightView(val)}
      </div>
    );
  };
  const rightView = (val) => {
    const metaData = JSON.parse(val.meta_data);
    return (
      <div className="right-view">
        {metaData.image && (
          <Image
            size={60}
            shape="square"
            borderRadius="3px"
            source={val.image}
          ></Image>
        )}
        {!metaData.image&&metaData.content && <p className="post-content item-eli">{metaData.content}</p>}
      </div>
    );
  };
  const notificationsType = (val) => {
    const metaData = JSON.parse(val.meta_data);
    //type :new_comment, new_like, new_fans, new_forward
    switch (val.message_type) {
      case "new_like":
        return (
          <div className="like-icon">
            <Image source={like} shape="square" size={16}></Image>
          </div>
        );
      case "new_fowards":
        return <div>
          <p className="forward">Forward your post</p>
          <p className="item-content">{metaData.content}</p>
        </div>;
      case "new_fans":
        return <p className="forward">new_fans</p>;
      case "new_comment": // 我评论了某人的评论需要返回某人的用户信息和评论这条数据的信息
        return <div>{metaData.content && <p className="item-content">{metaData.content}</p>}</div>;
      default:
        return ''
    }
  };
  return (
    <div>
      <Navbar title={t("NotificationsPageTitle")} />
      <PullList
        renderView={renderView}
        data={dataSource}
        load={fetchData}
      ></PullList>
    </div>
  );
};
export default Notifications;
