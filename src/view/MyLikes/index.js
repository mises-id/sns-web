/*
 * @Author: lmk
 * @Date: 2021-07-15 23:43:29
 * @LastEditTime: 2022-01-07 16:09:23
 * @LastEditors: lmk
 * @Description: my post page
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/styles/followPage.scss";
import "./index.scss";
import { likesData } from "@/api/status";
import PullList from "@/components/PullList";
import Navbar from "@/components/NavBar";
import { useSelector } from "react-redux";
import { useChangePosts, useList } from "@/utils";
import PostItem from "@/components/PostItem";
const MyLikes = ({ history }) => {
  const user = useSelector((state) => state.user) || {};
  const [lastId, setlastId] = useState("");
  const [fetchData, last_id, dataSource, setdataSource] = useList(likesData, {
    uid: user.loginForm && user.loginForm.uid,
    limit: 20,
    last_id: lastId,
  });
  //getData
  useEffect(() => {
    setlastId(last_id);
  }, [last_id]);
  const { setLike, followPress } = useChangePosts(setdataSource, dataSource);
  const { t } = useTranslation();
  //render item
  const renderView = (val = {}, index) => {
    return (
      <PostItem
        val={val}
        key={index}
        index={index}
        history={history}
        changeFollow={followPress}
        setLike={setLike}
      />
    );
  };
  return (
    <div>
      <Navbar title={t("MyLikesPageTitle")} />
      <PullList
        renderView={renderView}
        data={dataSource}
        load={fetchData}
      ></PullList>
    </div>
  );
};
export default MyLikes;
