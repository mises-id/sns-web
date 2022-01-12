/*
 * @Author: lmk
 * @Date: 2021-07-08 15:07:17
 * @LastEditTime: 2022-01-11 11:07:23
 * @LastEditors: lmk
 * @Description:
 */
import { useEffect, useState } from "react";
import PullList from "@/components/PullList";
import { following, followingLatest, recommend, recommendUser } from "@/api/status";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Badge } from "zarm";
import { useTranslation } from "react-i18next";
import { objToUrl, useChangePosts, useList, username } from "@/utils";
import PostItem from "@/components/PostItem";
import emptyIcon from "@/images/nothing.png";
import recommendationIcon from "@/images/recommendation.png";
import "./index.scss";
// import { useLocation } from "react-router-dom";
import Image from "@/components/Image";
import { getNotifications } from "@/api/notifications";
import { setFollowingBadge } from "@/actions/user";
import { useLocation } from "react-router-dom";
const Follow = ({ history = {} }) => {
  const user = useSelector((state) => state.user) || {};
  const location = useLocation() || {}
  const isDiscoverPage = location.pathname || '';
  const [isDiscover, setisDiscover] = useState(false);
  const fn = isDiscoverPage.indexOf("discover") > -1 ? recommend : following;
  const [lastId] = useState("");
  const [loading, setloading] = useState(true);
  // get dataList
  const [fetchData,last_id, dataSource, setdataSource] = useList(fn, {
    uid: user.loginForm && user.loginForm.uid,
    limit: 10,
    last_id: lastId,
  });
  console.log(last_id)
  const [isAuto] = useState(true);
  // const location = useLocation();
  // useEffect(() => {
  //   if (history.state) {
  //     //  && history.state.dataSource.length
  //     // setdataSource(history.state.dataSource);
  //     // setlastId(history.state.last_id);
  //     // setisAuto(false);
  //     console.log(history.state)
  //     // setTimeout(() => {
  //     // const pull = document.querySelector('.za-pull.m-layout');
  //     // pull.scrollTop = history.state.scrollTop
  //     //   console.log(history.state,1233)
  //     // }, 300);
  //   }
  // }, [location.pathname]);
  // useEffect(() => {
  //   setlastId(last_id);
  //   history.state = {
  //     ...history.state,
  //     last_id,
  //   };
  // }, [last_id]);
  // set discoverpage flag
  // get notification total;
  const [notifitionObj, setnotifitionObj] = useState({
    "total": 0,
    "notifications_count": 0,
    "users_count": 0
  })
  const dispatch = useDispatch(null);
  const [userRecommend, setuserRecommend] = useState([])
  const [followingLatestArr, setfollowingLatest] = useState([])
  // Get the required status of the page, get recommended users, and get the update list of concerned users
  useEffect(() => {
    const isDiscoverFlag = isDiscoverPage.indexOf("discover") > -1
    setisDiscover(isDiscoverFlag);
    setloading(false);
    if(!isDiscoverFlag&&user.token){
      // notice
      
      getNotifications().then(res=>{
        setnotifitionObj(res)
        dispatch(setFollowingBadge({
          total:res.total,
          notifications_count:res.notifications_count
        }))
      }).catch(error=>{
        console.log(error)
      })
      // follow latest user list
      followingLatest().then(res=>{
        setfollowingLatest(res || [])
      }).catch(error=>{
        console.log(error)
      })
    }
    if(isDiscoverFlag){
      // recommend user
      recommendUser().then(res=>{
        setuserRecommend(res || [])
      }).catch(error=>{
        console.log(error)
      })
    }
    // eslint-disable-next-line
  }, [isDiscover, isDiscoverPage]);
  const { setLike, followPress } = useChangePosts(setdataSource, dataSource);
  const renderView = (val = {}, index) => {
    return (
      <div style={index === 0 ? { marginTop: "10px" } : {}} key={index}>
        <PostItem
          val={val}
          key={index}
          index={index}
          history={history}
          changeFollow={followPress}
          setLike={setLike}
        />
      </div>
    );
  };
  const { t } = useTranslation();
  const find = () => {
    history.push("/home/discover");
  };
  // If you are not logged in, this view is displayed
  const btnElement = () => {
    return (
      <div className="empty-box">
        <img src={emptyIcon} alt="" className="empty-icon" />
        <p className="m-colors-333 m-title m-margin-bottom20 m-padding-lr20 m-tips">
          {t("unloginFollowingTitle")}
        </p>
        <p className="m-font15 m-colors-666 m-padding-lr20 m-tips">
          {t("unloginFollowingsecTitle")}
        </p>
        <div className="find m-font14" onClick={find}>
          {t("findAccounts")}
        </div>
      </div>
    );
  };
  // Render top recommendations and concerns
  const otherView = () => {
    //&&user.token
    return !isDiscover ? followers() : recommendation();
  };
  // Return to recommendation list
  const renderRecommendView = () => {
    const renderView = userRecommend.map((val, index) => {
      const {avatar={},username,uid,is_followed,misesid} = val.user
      const avatarStr = avatar&&avatar.medium ? avatar.medium : ''
      return (
        <div key={index} className="user-item" onClick={()=>userDetail({username,uid,is_followed,avatar:avatarStr,misesid})}>
          <div className="user-avatar">
            <div className="circle">
              <Image
                size={60}
                source={avatarStr}
              />
            </div>
            <div className="add-icon">
              <Image source={recommendationIcon} size={20}></Image>
            </div>
          </div>
          <p className="user-name">{username}</p>
        </div>
      );
    });
    return renderView;
  };
  // Rendering recommendation list
  const recommendation = () => {
    const renderView = renderRecommendView();
    return (
      <>
        {renderView.length > 0 && (
          <div>
            <p className="recommendation">Recommendation:</p>
            <div className="scroll-view">{renderView}</div>
          </div>
        )}
      </>
    );
  };
  // Return to followers list
  const renderFollowersView = () => {
    const renderView = followingLatestArr.map((val, index) => {
      const {avatar={},usernameStr=username(val.user),uid,is_followed,misesid} = val.user;
      const avatarStr = avatar&&avatar.medium ? avatar.medium : ''
      return (
        <div key={index} className="user-item" onClick={()=>userDetail({username:usernameStr,uid,is_followed,avatar:avatarStr,misesid})}>
          <div className="user-avatar">
            <div className="circle">
              <Image
                size={60}
                source={avatarStr}
              />
            </div>
            <div className="new-message-icon">
              {val.unread&&<Badge />}
            </div>
          </div>
          <p className="user-name">{usernameStr}</p>
        </div>
      );
    });
    return renderView;
  };
  // route push to userDetail
  const userDetail = ({uid,username,avatar,is_followed,misesid}) =>{
    history.push({
      pathname:'/userDetail',
      search:objToUrl({uid,username,avatar,is_followed,misesid})
    })
  }
  const notificationPage = () => history.push({ pathname: "/notifications",search:objToUrl({count: notifitionObj.notifications_count})});
  const followers = () => {
    const renderView = renderFollowersView();
    return (
      <div className="follower-view">
        {renderView.length > 0 && (
          <div className="scroll-view">{renderView}</div>
        )}
        {notifitionObj.notifications_count>0&&<div className="notification" onClick={notificationPage}>
          {/* <Image
            size={30}
            source={notifitionObj.firstMessage.avatar}
          /> */}
          <div className="notification-txt">{notifitionObj.notifications_count} Notification</div>
        </div>}
      </div>
    );
  };
  return (
    <div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <ActivityIndicator type="spinner" />
        </div>
      ) : !isDiscover && !user.token ? (
        btnElement()
      ) : (
        <PullList
          otherView={otherView}
          isAuto={isAuto}
          renderView={renderView}
          data={dataSource}
          load={fetchData}
        ></PullList>
      )}
    </div>
  );
};
export default Follow;
