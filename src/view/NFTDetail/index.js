/*
 * @Author: lmk
 * @Date: 2021-07-15 12:51:04
 * @LastEditTime: 2022-05-16 11:04:16
 * @LastEditors: lmk
 * @Description: NFT page
 */
import React, {useEffect,  useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";
import Navbar from "@/components/NavBar";
import { Image, Tabs } from "antd-mobile";
import like_NFT_big_hover from '@/images/like_NFT_big_hover.png'
import like_NFT_big from '@/images/like_NFT_big.png'
import Airdrop from '@/images/Airdrop.png'
import { useLogin } from "@/components/PostsIcons/common";
import { getNFTDetail, likeNFT,unlikeNFT } from "@/api/user";
import { useLoginModal, username, useRouteState } from "@/utils";
import { GlobalPullView } from "./GlobalPullView";
import { CommentView } from "../Post/CommentView";
import { useSelector } from "react-redux";
const NFTDetail = (props) => {
  const {t} = useTranslation();
  const state = useRouteState()
  const user = useSelector((state) => state.user) || {};
  // tab title
  const tabTitle = (title,num)=> <span className="NFT-detail-tab-title">{title}{num ? `(${num})` : ''}</span>
  const [activeKey,setActiveKey] = useState('like')
  const {isLogin} = useLogin()
  const loginModal = useLoginModal();

  const [nftInfo,setnftInfo] = useState({
    image_url:state.image,
    name:state.name,
    id:state.tokenId
  })

  useEffect(() => {
    if(nftInfo.id){
      getNFTDetail(nftInfo.id).then(res=>{
        setnftInfo(res)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // validate login
  const hasLogin = (e, fn) => {
    e.stopPropagation();
    if (!isLogin) {
      loginModal(fn, { type: "isLogin" });
      return false;
    }
    fn && fn();
  };
  // like and unlike
  const like = ()=>{
    const likeFn = nftInfo.is_liked ? unlikeNFT : likeNFT;
    likeFn(nftInfo.id).then(_=>{
      setnftInfo({
        ...nftInfo,
        is_liked: !nftInfo.is_liked
      })
    })
  }
  return (
    <div>
      <Navbar title={t("NFTDetailPageTitle")} />
      <div className="m-bg-f8f8f8 NFT-detail m-layout">
        <div className="m-bg-fff NFT-detail-content">
          <div className="m-position-relative">
            <Image src={nftInfo.image_url} className="NFT-detail-img" fit="cover"/>
            <img src={nftInfo.is_liked ? like_NFT_big_hover : like_NFT_big} alt="" onClick={e=>hasLogin(e,like)} className="NFT-detail-like"/>
          </div>
          <p className="NFT-detail-title">{nftInfo.name}</p>
          <div className="NFT-detail-descitem m-grid grid-cols-3">
            <div className="descitem">
              <p>{nftInfo.price || '0 ETH'}</p>
              <p>Floor Price</p>
            </div>
            <div className="descitem">
              <p>{nftInfo.rarity || '0%'}</p>
              <p>Rarity</p>
            </div>
            <div className="descitem">
              <p>{username(nftInfo.user)}</p>
              <p>Owner</p>
            </div>
          </div>
          <p className="link m-flex m-flex-center">
            Want to buy it?  <a href={nftInfo.perma_link} target="_blank" rel="noreferrer">Click here</a>
            <img src={Airdrop} alt="" />
          </p>
        </div>
        {/* like comment and activity tab */}
        <div className="NFT-detail-tab m-bg-fff">
          <div className="tabContainer">
            <Tabs activeLineMode="full" destroyOnClose activeKey={activeKey} onChange={setActiveKey}>
              <Tabs.Tab title={tabTitle(t('NFTDetailLike'),nftInfo.likes_count)} key='like'>
              </Tabs.Tab>
              <Tabs.Tab  title={tabTitle(t('NFTDetailComment'),nftInfo.comments_count)}  key='comment'>
              </Tabs.Tab>
              <Tabs.Tab  title={tabTitle(t('NFTDetailActivity'))}  key='activity'>
              </Tabs.Tab>
            </Tabs>
          </div>
          <div className="tab-container">
            {nftInfo.id && ['like','activity'].includes(activeKey)&&<GlobalPullView key={activeKey} type={activeKey} nftInfo={nftInfo}/> }
            {nftInfo.id && activeKey === 'comment' &&  <div className="comment-view">
              <CommentView item={{nft_asset_id:nftInfo.id,user:{uid:user.loginForm&&user.loginForm.uid}}} type="NFT"/>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default NFTDetail;
