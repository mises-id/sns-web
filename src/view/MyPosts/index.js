/*
 * @Author: lmk
 * @Date: 2021-07-15 23:43:29
 * @LastEditTime: 2022-01-28 22:03:17
 * @LastEditors: lmk
 * @Description: my post page
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/styles/followPage.scss";
import Image from "@/components/Image";
import send from "@/images/send.png";
import "./index.scss";
import { deletePosts, myPostsData } from "@/api/status";
import PullList from "@/components/PullList";
import Navbar from "@/components/NavBar";
import { useSelector } from "react-redux";
import { ActionSheet, Toast } from "zarm";
import { useChangePosts, useList } from "@/utils";
import PostItem from "@/components/PostItem";
import { refreshByCacheKey } from "react-router-cache-route";
const MyPosts = ({ history }) => {
  const user = useSelector((state) => state.user) || {};
  const [deleteLoading, setdeleteLoading] = useState(false);
  // remove post
  const deleteItem = ({ id }, index) => {
    if (deleteLoading) return false;
    setdeleteLoading(true);
    deletePosts(id)
      .then((res) => {
        Toast.show(t("deleteSuccess"));
        dataSource.splice(index, 1);
        setdataSource([...dataSource]);
        if (dataSource.length === 0) {
          //if empty
          setlastId("");
          fetchData();
        }
        setdeleteLoading(false);
      })
      .catch((res) => {
        setdeleteLoading(false);
      });
  };
  // show assentSheet
  const [visible, setVisible] = useState(false)
  const [acitve, setAcitve] = useState({})
  /* 
  {
    text:'Edit',
    onClick: () => {
      createPosts({id:acitve.val.id})
      setVisible(false)
    }
  }, */
  const BUTTONS = [{
    text:'Delete',
    theme: 'danger',
    onClick: () => {
      deleteItem(acitve.val,acitve.index)
      setVisible(false)
      window.dropByCacheKey('/home/following')
    }
  }]
  const showCheckItem = (val,index)=>{
    setVisible(true)
    setAcitve({val,index})
  }
  const [lastId, setlastId] = useState("");
  const [fetchData, last_id, dataSource, setdataSource] = useList(myPostsData, {
    uid: user.loginForm && user.loginForm.uid,
    limit: 20,
    last_id: lastId,
  });
  //getData
  useEffect(() => {
    setlastId(last_id);
  }, [last_id]);
  const { setLike, followPress } = useChangePosts(setdataSource, dataSource);
  const createPosts = () => {
    history.push({ pathname: "/createPosts"})
  };
  const { t } = useTranslation();
  //render item
  const renderView = (val = {}, index) => {
    return (
      <PostItem
        val={val}
        key={index}
        deleteItem={() => showCheckItem(val, index)}
        index={index}
        history={history}
        changeFollow={followPress}
        btnType="myPosts"
        setLike={setLike}
      />
    );
  };

  useEffect(() => {
    refreshByCacheKey('/home/following')
    refreshByCacheKey('/home/discover')
  }, []);
  return (
    <div>
      <Navbar title={t("myPostPageTitle")} />
      <PullList
        renderView={renderView}
        data={dataSource}
        load={fetchData}
      ></PullList>
      <div className="m-position-fixed createPosts">
        <Image size={75} onClick={createPosts} source={send}></Image>
      </div>
      <ActionSheet
        spacing
        visible={visible}
        actions={BUTTONS}
        onMaskClick={() => setVisible(!visible)}
        onCancel={() => setVisible(!visible)}
      />
    </div>
  );
};
export default MyPosts;
