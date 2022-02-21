/*
 * @Author: lmk
 * @Date: 2021-07-15 13:41:35
 * @LastEditTime: 2022-02-14 10:04:54
 * @LastEditors: lmk
 * @Description: Following and Followers page
 */
import Cell from "@/components/Cell";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import friend from "@/images/friend.png"; //friend
import following from "@/images/followed.png"; // my follow
import fans from "@/images/fans.png"; //fans
import "./index.scss";
import { useHistory } from "react-router-dom";
import { friendShip } from "@/api/fans";
import { useSelector } from "react-redux";
import PullList from "@/components/PullList";
import Navbar from "@/components/NavBar";
import { objToUrl, useList, username, useRouteState } from "@/utils";
import { followed } from "@/components/PostsIcons/common";
import { refreshByCacheKey } from "react-router-cache-route";
const Following = ({ pageType,uid }) => {
  const { t } = useTranslation();
  const state = useRouteState();
  // const { state = {} } = location || {};
  const type = pageType || state.pageType || "following";
  const pageTitle = `${type}PageTitle`;
  const user = useSelector((state) => state.user) || {};
  const [followLoading, setfollowLoading] = useState(false);
  const [propUid, setPropUid] = useState(uid)
  const history = useHistory()
  const [lastId, setlastId] = useState("");
  const {loginForm={}} = user;
  const [fetchData, last_id, dataSource, setdataSource] = useList(friendShip, {
    uid: propUid || (user.loginForm && user.loginForm.uid),
    relation_type: type==='fans' ? 'fan' : type,
    limit: 20,
    last_id: lastId,
  });
  const renderView = (val = {}, index) => {
    const user = val.user;
    const icon = {
      following: following,
      fan: fans,
      friend: friend,
    }[val.relation_type];
    const setFollow = async e => {
      e.stopPropagation()
      const followFlag = val.relation_type === "fan"; // 为粉丝则没有互相关注
      try {
        if (followLoading) return false;
        const followObj = {
          user: {
            uid: val.user.uid,
            is_followed: !followFlag,
            misesid: val.user.misesid,
          },
        };
        setfollowLoading(true);
        await followed(followObj);
        setfollowLoading(false);
        if (val.relation_type === "fan") {
          const followType =
            type === "following" && val.old_relation_type !== "friend"
              ? "following"
              : "friend";
          setData(followType);
          return false;
        }
        setData("fan");
      } catch (error) {
        console.log(error);
        setfollowLoading(false);
      }
    };
    const setData = (type, index) => {
      if (!val.old_relation_type) val.old_relation_type = val.relation_type;
      val.relation_type = type;
      dataSource[index] = val;
      //dataSource.splice(index,1);
      setdataSource([...dataSource]);
    };
    const personDetail = item=>{
      history.push({
        pathname: "/userDetail",
        search: objToUrl({
          ...item,
          avatar: item.avatar ? item.avatar.large : ''
        }),
      });
    }
    const isMe = loginForm.uid===val.user.uid
    return (
      <Cell
        iconSize={35}
        className="m-bg-fff m-padding-lr15 m-padding-tb12"
        showArrow={false}
        label={username(user)}
        key={index}
        onPress={()=>personDetail(user)}
        icon={user.avatar ? user.avatar.medium : ""}
        rightChild={
          isMe ? '':<img
            onClick={setFollow}
            className="followedIcon"
            src={icon}
            alt="followIcon"
          />
        }
      ></Cell>
    );
  };
  useEffect(() => {
    setPropUid(uid)
  }, [uid])
  //set last id
  useEffect(() => {
    setlastId(last_id);
  }, [last_id]);
  // refresh home page
  useEffect(() => {
    refreshByCacheKey('/home/me')
  }, []);
  
  return (
    <div>
      {/* If the page has a pagetype value, it is a component reference; otherwise, it is a routing page */}
      {!pageType&&<Navbar title={t(pageTitle)} />}
      <PullList
        renderView={renderView}
        data={dataSource}
        load={fetchData}
      ></PullList>
    </div>
  );
};
export default Following;
