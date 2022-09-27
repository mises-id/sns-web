/*
 * @Author: lmk
 * @Date: 2021-07-15 01:03:58
 * @LastEditTime: 2022-09-27 09:25:57
 * @LastEditors: lmk
 * @Description:
 */
import Avatar from "@/components/NFTAvatar";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import deteleIcon from "@/images/arrow-down.png";
import privateIcon from "@/images/private.png";
import { useLogin } from "@/components/PostsIcons/common";
import { useDispatch, useSelector } from "react-redux";
import { formatTimeStr, objToUrl, useLoginModal, username } from "@/utils";
import MButton from "@/components/MButton";
import addIcon from "@/images/add.png";
import { useHistory } from "react-router-dom";
import { Image, Popover } from "antd-mobile";
import { setReportVisibility } from "@/actions/app";
const UserHeader = ({
  size,
  btnType = "follow",
  item = {},
  followed,
  deleteItem,
}) => {
  const { t } = useTranslation();
  const { isLogin } = useLogin();
  const { loginForm = {} } = useSelector((state) => state.user) || {};
  const isMe = loginForm.uid === item.uid;
  const loginModal = useLoginModal();
  const history = useHistory();
  const hasLogin = (e, fn) => {
    e.stopPropagation();
    if (!isLogin) {
      loginModal(fn, { type: "isLogin" });
      return false;
    }
    fn && fn();
  };
  const onClick = (e) => {
    e.stopPropagation();
    if (!isMe) {
      const avatar = item.avatar ? item.avatar.medium : "";
      history.push({
        pathname: "/userDetail",
        search: objToUrl({ uid: item.uid, username: item.username, avatar,is_followed: item.is_followed,misesid:item.misesid }),
      });
    }
  };
  const isFollow = item.is_followed ? "followedTxt" : "followTxt";
  const followedItem = (e) => hasLogin(e, followed);
  const deleteItemClick = (e) => hasLogin(e, deleteItem);
  const popoverRef = useRef(null);
  const [reportVisible,setreportVisible] = useState(false);
  const showReport = (e)=>{
    hasLogin(e, ()=>{
      setreportVisible(!reportVisible)
    })
  }
  const dispatch = useDispatch()
  const report = ()=>{
    dispatch(setReportVisibility(true))
    setreportVisible(false)
  }
  document.addEventListener('click',()=>{
    setreportVisible(false)
  })
  useEffect(() => {
    const container = document.querySelector('.m-layout')
    if(container) container.style.overflow = reportVisible ? 'hidden' : 'auto'
  }, [reportVisible])
  
  return (
    <div className={`m-flex m-row-between ${size ? "forward" : "normal"}`}>
      <div className="m-flex">
        <Avatar avatarItem={item.avatar} size={size} onClick={onClick}/>
        <div className={!size ? "m-margin-left12" : "m-margin-left8"}>
          <span className="nickname">{username(item)}</span>
          {item.created_at&&<div
            className={
              !size ? "m-margin-top8 timeAndType" : "m-margin-top4 timeAndType"
            }
          >
            {formatTimeStr(item.created_at)}
            <span className="m-margin-left3">{item.from_type}</span>
            {!item.is_public&&<img src={privateIcon} alt="" width="9px" style={{marginLeft:'8px'}}/>}
          </div>}
        </div>
      </div>
      {!isMe && btnType === "follow" && ( 
        <div className="m-flex">
          <MButton
            txt={t(isFollow)}
            onPress={followedItem}
            {...(item.is_followed
              ? {
                  borderColor: "#DDDDDD",
                  txtColor: "#666",
                  txtSize: !size ? 12 : 11,
                }
              : {})}
            imgIcon={!item.is_followed ? addIcon : ""}
            width={!size ? 70 : 60}
            height={!size ? 25 : 20}
          />
          <Popover.Menu
            actions={[{
              text: 'Report',icon: null
            }]}
            ref={popoverRef}
            onAction={report}
            visible={reportVisible}
            trigger='click'
            placement='bottom'
          >
            <Image src="/static/images/more.png" lazy={false} width={20} onClick={showReport}/>
          </Popover.Menu>
        </div>
      )}
      {btnType === "myPosts" && (
        <MButton
          iconSize={11}
          imgIcon={deteleIcon}
          borderColor="#DDDDDD"
          onPress={deleteItemClick}
        />
      )}
    </div>
  );
};
export default UserHeader;
