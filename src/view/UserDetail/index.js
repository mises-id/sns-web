import React, { useEffect, useRef, useState } from "react";
import userBack from "@/images/user_back.png";
import quotes_left from "@/images/quotes_left.png";
import quotes_right from "@/images/quotes_right.png";
import Airdrop from "@/images/Airdrop.png";
// import userMore from "@/images/user_more.png";
import "./index.scss";
import Avatar from "@/components/NFTAvatar";
import { useTranslation } from "react-i18next";
import MButton from "@/components/MButton";
import { getLink, numToKMGTPE, objToUrl, urlToJson, useChangePosts, useLoginModal, username, useRouteState } from "@/utils";
import { useLogin } from "@/components/PostsIcons/common";
import addIcon from "@/images/add.png";
import { ActionSheet, Toast } from "zarm";
import {Tabs} from 'antd-mobile'
import UserPosts from "./UserPost";
import UserLikes from "./UserLike";
import { useHistory } from "react-router-dom";
import { clearCache, useDidRecover } from 'react-router-cache-route'
import { getUserDetailNFTAsset, getUserInfo, JoinBlackList, removeBlackList } from "@/api/user";
import {Image,Button} from 'antd-mobile'
import block from '@/images/block.png';
import { useThrottleFn } from 'ahooks'
import Navbar from "@/components/NavBar";
const UserDetail = (props) => {
  const [userInfo, setUserInfo] = useState({});
  const { t } = useTranslation();
  const { isLogin } = useLogin();
  const [value, setvalue] = useState('0');
  const state = useRouteState();
  useEffect(() => {
    getNFT(state.uid)
    setInfo(state)
    setvalue('0')
    // eslint-disable-next-line
  }, [state.uid]); 
  useDidRecover(() => {
    const historyState = urlToJson(window.location.search);
    getNFT(historyState.uid)
    setInfo(historyState)
    if(JSON.stringify(historyState)!==JSON.stringify(state)){
      window.refreshByCacheKey("/userDetail")
    }
    window.refreshByCacheKey("/userFollowPage")
    window.refreshByCacheKey("/comment")
    window.refreshByCacheKey("/post")
    window.refreshByCacheKey("/NFTDetail")
  },[state])
  const setInfo = (state) =>{
    const uid = state.uid
    state.uid = ''
    state.avatar = {
      medium: state.avatar,
    }
    setUserInfo(state);
    getUserInfo(uid).then(res=>{
      setUserInfo(res);
      state.uid = res.uid;
      const btnArr = res.is_blocked ? removeBlackButton : joinBlackButton;
      setbuttons(btnArr)
    }).catch(err=>{
      console.log(err)
    })
  }
  const history = useHistory();
  // show assentSheet
  const successBlock = ()=>{
    setInfo(state)
    Toast.show(t('succcess'))
    clearCache()
  }
  const [visible, setVisible] = useState(false)
  const joinBlackButton = [{ // Black user
    text:'Block',
    theme: 'danger',
    onClick: ()=>{
      JoinBlackList({uid:Number(state.uid)}).then(successBlock)
      setVisible(false)
    }
  }]
  const removeBlackButton = [{ // Black user
    text:'unBlock',
    theme: 'danger',
    onClick: () => {
      removeBlackList(state.uid).then(successBlock)
      setVisible(false)
    }
  }]
  // Judge the display content according to the status
  const [buttons, setbuttons] = useState(joinBlackButton)
  // const showCheckItem = ()=> setVisible(true)
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
  // router push this NFT detail
  const NFTDetail = ()=>{
    if(!userInfo.avatar.nft_asset_id) return 
    routeToNFTDetail({ tokenId: userInfo.avatar.nft_asset_id,image:userInfo.avatar.medium })
  }
  const routeToNFTDetail = (item)=>{
    history.push({
      pathname: "/NFTDetail",
      search: objToUrl(item),
    });
  }
  const [NFTList, setNFTList] = useState([]);
  const getNFT = (uid)=>{
    if(!uid) return 
    getUserDetailNFTAsset({scene:'recommend',limit:3,uid}).then(res=>{
      setNFTList(res.data)
    })
  }
  // view more 
  const userAllNFT = ()=>{
    history.push({
      pathname: "/NFT",
      search: objToUrl({ uid: userInfo.uid}),
    });
  }
  const [showNavBar, setShowNavBar] = useState(false)
  const { run: handleScroll } = useThrottleFn(
    e => {
      
      if(e.target.scrollTop > 60&&!showNavBar){
        setShowNavBar(true)
      }
      if(e.target.scrollTop < 60&&showNavBar){
        setShowNavBar(false)
      }
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    }
  )
  const userDetail = useRef(null)
  useEffect(() => {
    userDetail.current.addEventListener('scroll', handleScroll)
    return () => {
      // eslint-disable-next-line
      if(userDetail.current) userDetail.current.removeEventListener('scroll', handleScroll)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {showNavBar&&<Navbar title={username(userInfo)} fixed/>}
      <div className="app-container user-detail" ref={userDetail}>
        <div className="user-detail-header" style={{backgroundImage:"url(/static/images/user_bg.jpg)"}}>
          {/* header */}
          <div className="m-flex nav-box m-row-between">
            <img
              src={userBack}
              className="nav-icon"
              alt=""
              onClick={back}
            ></img>
          </div>
          {/* userinfo */}
          <div className="userinfo-box m-flex">
            <div className="avatar-box">
              <Avatar avatarItem={userInfo.avatar} size="75px" NFTTagSize="48px" onClick={NFTDetail}/>
            </div>
            <div className="m-flex-1 user-info">
              <div className="m-flex m-row-between">
                <span className="username">{username(userInfo)}</span>
                {userInfo.is_blocked ? '' : <MButton
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
                />}
              </div>
              <div className="follow-box m-flex">
                <div onClick={() => getFollow(0)}>
                  <span className="follow-num">{numToKMGTPE(userInfo.followings_count) || 0}</span>
                  <span className="follow-name">Following</span>
                </div>
                <div onClick={() => getFollow(1)}>
                  <span className="follow-num">{numToKMGTPE(userInfo.fans_count) || 0}</span>
                  <span className="follow-name">Followers</span>
                </div>
              </div>
            </div>
          </div>
          {/* user intro */}
          {userInfo.intro&&<div className="intro-content">
            <img src={quotes_left} alt="" className="quotes left"/>
            <div className="intro-txt" 
            dangerouslySetInnerHTML={{ __html: getLink(userInfo.intro) }}></div>
            <img src={quotes_right} alt="" className="quotes right"/>
          </div>}
          {/* user NFT list */}
          {NFTList.length>0&&<div className="NFT-list">
            <p className="NFT-title">User’s NFT</p>
            <div className="m-grid nft-list-items">
              {NFTList.map((val,index)=>{
                return <div key={index} className="grid-item" onClick={()=>routeToNFTDetail({name:val.name,image:val.image_url,tokenId:val.id})}>
                  <Image src={val.image_preview_url} width={100} height={100} fit='cover' style={{ borderRadius: 10 }} />
                  <p className="nft-name">{val.name}</p>
                </div>
              })}
            </div>
          </div>}
          {NFTList.length>0&&<div className="view-more">
            <Button color='primary' fill='outline' onClick={userAllNFT} block shape='rounded'>
              <div className="m-flex">
                <span>View More User’s NFT</span>
                <img src={Airdrop} alt=""/>
              </div>
            </Button>
          </div>}
        </div>
        {/* tab content */}
        {userInfo.uid && !userInfo.is_blocked &&(
          <div className="tab-content">
            <div className="tab-header">
              <Tabs activeLineMode="fixed"  activeKey={value} onChange={setvalue}>
                <Tabs.Tab title="Posts" key={0} />
                <Tabs.Tab  title="Likes" key={1} />
              </Tabs>
            </div>
            {value==='0' ? <UserPosts uid={userInfo.uid} /> : ''}
            {value==='1' ? <UserLikes uid={userInfo.uid} /> : ''}
          </div>
        )}
        {userInfo.uid && userInfo.is_blocked&& <div className="blockStatus m-flex m-row-center m-margin-tb15 block-box">
          <img src={block} alt="" width={20}/>
          <span className="delete-txt">{t('postBlock')}</span>
        </div>}
      </div>
      <ActionSheet
        spacing
        visible={visible}
        actions={buttons}
        onMaskClick={() => setVisible(!visible)}
        onCancel={() => setVisible(!visible)}
      />
    </>
  );
};
export default UserDetail;
