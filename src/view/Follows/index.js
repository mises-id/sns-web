/*
 * @Author: lmk
 * @Date: 2021-07-08 15:07:17
 * @LastEditTime: 2022-05-19 10:19:37
 * @LastEditors: lmk
 * @Description:
 */
import { useEffect, useState } from "react";
import PullList from "@/components/PullList";
import { following, followingLatest, recent, recommend } from "@/api/status";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Badge, Button, Modal } from "zarm";
import { useTranslation } from "react-i18next";
import {
  objToUrl,
  useChangePosts,
  useList,
  username,
  useSetDataSourceAction,
} from "@/utils";
import PostItem from "@/components/PostItem";
import emptyIcon from "@/images/nothing.png";
import recommendationIcon from "@/images/recommendation.png";
import "./index.scss";
// import { useLocation } from "react-router-dom";
import Image from "@/components/Image";
import { getNotifications } from "@/api/notifications";
import { setFollowingBadge } from "@/actions/user";
import { useDidRecover } from "react-router-cache-route";
import Avatar from '@/components/NFTAvatar'
const Follow = ({ history = {} }) => {
  // Is it a discover page
  const isDiscoverFn = ()=> {
    const isDiscoverPage = window.location.pathname || "";
    return !['/home/following','/home/recent'].includes(isDiscoverPage)
  }

  const fn = {
    '/home/following': following,
    '/home/recent': recent,
    '/home/discover': recommend,
  }[window.location.pathname]

  const user = useSelector((state) => state.user) || {};
  const [lastId] = useState("");
  const [loading, setloading] = useState(true);
  const [isAuto] = useState(true);
  const [isFollowing] = useState(window.location.pathname==='/home/following');
  const [isDiscover] = useState(window.location.pathname==='/home/discover');
  const storeageKey = `discoverPageCache${user.loginForm&&user.loginForm.uid  ? user.loginForm.uid : ''}`
  const dispatch = useDispatch(null);
  const [userRecommend] = useState([]);
  const [followingLatestArr, setfollowingLatest] = useState([]);
  const { t } = useTranslation();
  const [
    fetchData,
    last_id,
    dataSource,
    setdataSource,
    downRefreshLastId,
    setdownRefreshLastId,
    setlast_id,
  ] = useList(
    fn,
    {
      uid: user.loginForm && user.loginForm.uid,
      limit: 10,
      last_id: lastId,
    },
    { type: isDiscoverFn() ? "refreshList" : "refresh",isCache: isDiscoverFn()}
  );
  useSetDataSourceAction(dataSource, setdataSource);
  //
  const [notifitionObj, setnotifitionObj] = useState({
    total: 0,
    notifications_count: 0,
    users_count: 0,
  });
  const setdataSourceStorage = (id)=>{
    if (isDiscoverFn()) {
      const start = 0;
      const maxCacheCount = 200;
      const data = dataSource.slice(start, maxCacheCount)
      console.log(last_id,downRefreshLastId)
      localStorage.setItem(
        storeageKey,
        JSON.stringify({
          last_id:id,
          downRefreshLastId:id,
          dataSource: data,
        })
      );
      return false;
    }
  }
  const { setLike, followPress } = useChangePosts(setdataSource, dataSource,setdataSourceStorage);
  // get dataList
  const getDiscoverCache = ()=>{
    let cache = localStorage.getItem(storeageKey);
    if (isDiscoverFn() && cache) {
      const { dataSource, downRefreshLastId, last_id } = JSON.parse(cache);
      setdataSource(unique(dataSource));
      setdownRefreshLastId(downRefreshLastId);
      setlast_id(last_id);
    }
  }
  useEffect(() => {
    getDiscoverCache()
    // eslint-disable-next-line
  }, []);
  // unique
  const unique = arr =>{
    const uniqueArr = []
    if(Array.isArray(arr)){
      arr.forEach(val=>{
        const flag = uniqueArr.some(item=>item.id===val.id);
        if(!flag) uniqueArr.push(val)
      })
    }
    return uniqueArr
  }
  
  // Get the required status of the page, get recommended users, and get the update list of concerned users
  useEffect(() => {
    setloading(false);
    // eslint-disable-next-line
  }, [isFollowing]);
  useDidRecover(() => {
    getFollowingLatest();
  });
  const getFollowingLatest = () => {
    // const isDiscoverFlag = isDiscoverFn();
    if (isFollowing && user.token) {
      // follow latest user list
      followingLatest()
        .then((res) => {
          setfollowingLatest(res || []);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (user.token) {
      getNotifications()
        .then((res) => {
          setnotifitionObj({
            ...res,
            avatar:
              res.latest_message && res.latest_message.user
                ? res.latest_message.user.avatar
                : {},
          });
          dispatch(
            setFollowingBadge({
              total: res.total,
              notifications_count: res.notifications_count,
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
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
  const find = () => history.push("/home/discover");
  const connect = () => {
    window.mises
      .requestAccounts()
      .catch((err) => {
        console.log(err);
        if (err && err.code === -32002) {
          Modal.alert({
            content: "Please switch to the unlock tab to unlock your account",
            width: "77%",
            title: "Message",
          });
        }
      });
  };
  const selector = useSelector((state) => state.user) || {};
  const [flag, setflag] = useState(false);
  const [misesloading, setMisesloading] = useState(true);
  let timer = null;
  const getMisesAccountFlag = () => {
    if (selector.web3Status) {
      window.mises &&
        window.mises.getMisesAccounts(true).then((res) => {
          setflag(!!res);
          setMisesloading(false)
        }).catch(err=>{
          console.log(err)
          setMisesloading(false)
        });
    }else{
      if(timer){
        clearTimeout(timer)
        timer = null;
      }
      timer = setTimeout(() => {
        setMisesloading(false)
      }, 2000);
    }
  };
  useEffect(() => {
    getMisesAccountFlag();
    // eslint-disable-next-line
  }, [selector.web3Status]);
  const getOldUid = localStorage.getItem('uid');
  useEffect(() => {
    const getUid = localStorage.getItem('uid');
    if(user.loginForm.uid===Number(getUid)&&getUid!==getOldUid){
      window.refreshByCacheKey('/home')
    }
    // eslint-disable-next-line
  }, [storeageKey])
  
  // If you are not logged in, this view is displayed
  const btnElement = () => {
    if(misesloading){
      return <div style={{ textAlign: "center", padding: "20px" }}>
      <ActivityIndicator type="spinner" />
    </div>
    }
    if(flag){
      return <div className="empty-box">
      <img src={emptyIcon} alt="" className="empty-icon" />
      <p className="m-colors-333 m-title m-margin-bottom20 m-padding-lr20 m-tips">
        {t("unloginTitle")}
      </p>
     <div className="connect">
      <Button block shape="round" theme="primary" onClick={connect}>
          <span className="btn-txt">{t("loginUser")}</span>
        </Button>
     </div>
    </div>
    }
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
    if(isFollowing){
      return followers()
    }
    if(isDiscover){
      return recommendation();
    }
  }
  // Return to recommendation list
  const renderRecommendView = () => {
    const renderView = userRecommend.map((val, index) => {
      const { avatar = {}, username, uid, is_followed, misesid } = val.user;
      const avatarStr = avatar && avatar.medium ? avatar.medium : "";
      return (
        <div
          key={index}
          className="user-item"
          onClick={() =>
            userDetail({
              username,
              uid,
              is_followed,
              avatar: avatarStr,
              misesid,
            })
          }
        >
          <div className="user-avatar">
            <div className="circle">
              <Avatar avatarItem={avatar} size='50px'/>
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
      const {
        avatar = {},
        usernameStr = username(val.user),
        uid,
        is_followed,
        misesid,
      } = val.user;
      const avatarStr = avatar && avatar.medium ? avatar.medium : "";
      return (
        <div
          key={index}
          className="user-item"
          onClick={() => {
            val.unread = false;
            setfollowingLatest([...followingLatestArr]);
            dispatch(
              setFollowingBadge({
                total: notifitionObj.total - 1,
                notifications_count: notifitionObj.notifications_count,
              })
            );
            userDetail({
              username: usernameStr,
              uid,
              is_followed,
              avatar: avatarStr,
              misesid,
            });
          }}
        >
          <div className="user-avatar">
            <div className="circle">
              <Avatar avatarItem={avatar} size="50px"></Avatar>
            </div>
            <div className="new-message-icon">{val.unread && <Badge />}</div>
          </div>
          <p className="user-name">{usernameStr}</p>
        </div>
      );
    });
    return renderView;
  };
  // route push to userDetail
  const userDetail = ({ uid, username, avatar, is_followed, misesid }) => {
    history.push({
      pathname: "/userDetail",
      search: objToUrl({ uid, username, avatar, is_followed, misesid }),
    });
  };
  const notificationPage = () => {
    setnotifitionObj({
      notifications_count: 0,
    });
    history.push({
      pathname: "/notifications",
      search: objToUrl({ notificationsType: 'unread' }),
    });
  };
  const followers = () => {
    const renderView = renderFollowersView();
    return (
      (renderView.length > 0 || notifitionObj.notifications_count > 0) && (
        <div className="follower-view">
          {renderView.length > 0 && (
            <div className="scroll-view">{renderView}</div>
          )}
          {notifitionObj.notifications_count > 0 && (
            <div className="notification" onClick={notificationPage}>
              <Avatar size="30px" avatarItem={notifitionObj.avatar}/>
              <div className="notification-txt">
                {notifitionObj.notifications_count} Notification
              </div>
            </div>
          )}
        </div>
      )
    );
  };
  return (
    isFollowing && !user.token ? (
      btnElement()
    ) : (
      <PullList
        otherView={otherView}
        isAuto={isAuto}
        renderView={renderView}
        data={dataSource}
        getSuccess={setdataSourceStorage}
        load={async (e) => {
          getFollowingLatest();
          const res = await fetchData(e);
          return res;
        }}
      />
    )
  );
};
export default Follow;
