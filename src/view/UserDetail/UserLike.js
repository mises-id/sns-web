/*
 * @Author: lmk
 * @Date: 2022-01-05 11:26:57
 * @LastEditTime: 2022-01-18 15:33:44
 * @LastEditors: lmk
 * @Description: user post list
 */
import { likesData } from "@/api/status";
import PostItem from "@/components/PostItem";
import PullList from "@/components/PullList";
import { useChangePosts, useList } from "@/utils";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const UserPosts = (props) => {
  const history = useHistory()
  const [lastId, setlastId] = useState("");
  const [fetchData, last_id, dataSource, setdataSource] = useList(likesData, {
    uid:props.uid,
    limit: 20,
    last_id: lastId,
  });
  //getData
  useEffect(() => {
    setlastId(last_id);
  }, [last_id]);
  const { setLike,followPress } = useChangePosts(setdataSource, dataSource);
  const renderView = (val = {}, index) => {
    return (
      <PostItem
        val={val.status}
        key={index}
        btnType="userDetail"
        index={index}
        history={history}
        changeFollow={followPress}
        setLike={setLike}
      />
    );
  };
  return (
    <div className="user-post-content" style={{'--window-height':`${window.innerHeight}px`}}>
      <PullList
        renderView={renderView}
        data={dataSource}
        load={fetchData}
      ></PullList>
    </div>
  );
};
export default UserPosts;
