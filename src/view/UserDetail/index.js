import React, { useEffect, useState } from "react";
import userBg from "@/images/user_bg.png";
import userBack from "@/images/user_back.png";
import userMore from "@/images/user_more.png";
import "./index.scss";
import Image from "@/components/Image";
import { useTranslation } from "react-i18next";
import MButton from "@/components/MButton";
import { objToUrl, useChangePosts, useLoginModal, username, useRouteState } from "@/utils";
import { useLogin } from "@/components/PostsIcons/common";
import addIcon from "@/images/add.png";
import { ActionSheet, Panel, Tabs, Toast } from "zarm";
import UserPosts from "./UserPost";
import UserLikes from "./UserLike";
import { useHistory } from "react-router-dom";
import { getUserInfo, JoinBlackList, removeBlackList } from "@/api/user";
const UserDetail = (props) => {
  const [userInfo, setUserInfo] = useState({});
  const { t } = useTranslation();
  const { isLogin } = useLogin();
  const [value, setvalue] = useState(0);
  const state = useRouteState();
  useEffect(() => {
    setUserInfo(state);
    getUserInfo(state.uid).then(res=>{
      setUserInfo(res);
      const btnArr = res.is_blocked ? removeBlackButton : joinBlackButton;
      setbuttons(btnArr)
    })
    // eslint-disable-next-line
  }, []); 
  const history = useHistory();
  // show assentSheet
  const [visible, setVisible] = useState(false)
  const joinBlackButton = [{ // Black user
    text:'Black',
    theme: 'danger',
    onClick: () => {
      blackUser()
      setVisible(false)
      Toast.show(t('succcess'))
    }
  }]
  const removeBlackButton = [{ // Black user
    text:'unBlack',
    theme: 'danger',
    onClick: () => {
      removeBlackUser()
      setVisible(false)
      Toast.show(t('succcess'))
    }
  }]
  // Judge the display content according to the status
  const [buttons, setbuttons] = useState(joinBlackButton)
  const blackUser = ()=>{
    JoinBlackList({uid:Number(state.uid)}).then(res=>{
      setbuttons(removeBlackButton)
    })
  }
  const removeBlackUser = ()=>{
    removeBlackList(state.uid).then(res=>{
      setbuttons(joinBlackButton)
    })
  }
  const showCheckItem = ()=> setVisible(true)
  const back = () => {
    window.history.back();
  };
  const loginModal = useLoginModal();
  const hasLogin = (e, fn) => {
    e.stopPropagation();
    if (!isLogin) {
      loginModal(fn, { type: "isLogin" });
      return false;
    }
    fn && fn();
  };
  const getFollow = (value) => {
    history.push({
      pathname: "/userFollowPage",
      search: objToUrl({ uid: userInfo.uid, username: username(userInfo), value }),
    });
  };
  const { followPress } = useChangePosts(setUserInfo, userInfo);
  const followedItem = (e) => hasLogin(e, async ()=>{
    await followPress(userInfo)
  });
  const isFollow = userInfo.is_followed ? "followedTxt" : "followTxt";
  return (
    <div>
      <div className="app-container">
        <div>
          {/* header */}
          <img src={userBg} className="user-bg" alt="userbg"></img>
          <div className="m-flex nav-box m-row-between">
            <img
              src={userBack}
              className="nav-icon"
              alt=""
              onClick={back}
            ></img>
            <img src={userMore} className="nav-icon" alt="" onClick={showCheckItem}></img>
          </div>
          {/* userinfo */}
          <div className="userinfo-box m-flex">
            <div className="avatar-box">
              <Image source={userInfo.avatar} size={75}></Image>
            </div>
            <div className="m-flex-1 user-info">
              <div className="m-flex m-row-between">
                <span className="username">{username(userInfo)}</span>
                <MButton
                  txt={t(isFollow)}
                  onPress={followedItem}
                  {...(userInfo.is_followed
                    ? {
                        borderColor: "#FFFFFF",
                        txtColor: "#FFFFFF",
                      }
                    : {
                        borderColor: "#FFFFFF",
                        backgroundColor: "#FFFFFF",
                        txtColor: "#666",
                      })}
                  imgIcon={!userInfo.is_followed ? addIcon : ""}
                  width={70}
                  height={25}
                />
              </div>
              <div className="follow-box m-flex">
                <div onClick={() => getFollow(0)}>
                  <span className="follow-num">{userInfo.followings_count}</span>
                  <span className="follow-name">Following</span>
                </div>
                <div onClick={() => getFollow(1)}>
                  <span className="follow-num">{userInfo.fans_count}</span>
                  <span className="follow-name">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* tab content */}
        {userInfo.uid && (
          <div className="tab-content">
            <div className="tab-header">
              <Tabs swipeable lineWidth={10} value={value} onChange={setvalue}>
                <Panel
                  title={
                    <span className={value === 0 ? "active" : "unactive"}>
                      Posts
                    </span>
                  }
                >
                  <UserPosts uid={userInfo.uid} />
                </Panel>
                <Panel
                  title={
                    <span className={value === 1 ? "active" : "unactive"}>
                      Likes
                    </span>
                  }
                >
                  <UserLikes  uid={userInfo.uid}/>
                </Panel>
              </Tabs>
            </div>
          </div>
        )}
      </div>
      <ActionSheet
        spacing
        visible={visible}
        actions={buttons}
        onMaskClick={() => setVisible(!visible)}
        onCancel={() => setVisible(!visible)}
      />
    </div>
  );
};
export default UserDetail;
