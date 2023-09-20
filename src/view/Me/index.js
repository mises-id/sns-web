/*
 * @Author: lmk
 * @Date: 2021-07-08 15:08:05
 * @LastEditTime: 2022-11-07 11:12:52
 * @LastEditors: lmk
 * @Description:
 */
import React, { memo, useEffect, useState } from "react";
import "./index.scss";
import { UndoOutline } from "antd-mobile-icons";
import { useTranslation } from "react-i18next";
import me_1 from "@/images/me_1.png";
import me_2 from "@/images/me_2.png";
import me_3 from "@/images/me_3.png";
import me_4 from "@/images/me_4.png";
import me_5 from "@/images/me_5.png";
import me_7 from "@/images/me_7.png";
import Cell from "@/components/Cell";
import { ActivityIndicator, Badge, Modal, Button } from "zarm";
import { useSelector } from "react-redux";
import bg from "@/images/me-bg.png";
import { objToUrl, username } from "@/utils";
import Avatar from "@/components/NFTAvatar";
import 'antd-mobile/es/global/global.css';
import { setWeb3ProviderMaxFlag } from "@/actions/user";
import { store } from "@/stores";
import { Button as AntdButton } from "antd-mobile";
import { fetchBonusCount } from "@/api/user";
import BigNumber from "bignumber.js";
// import {Skeleton} from 'antd-mobile'
const Myself = ({ history }) => {
  const { t } = useTranslation();
  const [loginForm, setLoginForm] = useState({});
  const [token, settoken] = useState("");
  // eslint-disable-next-line
  const selector = useSelector((state) => state.user) || {};
  const [list, setTabList] = useState([
    {
      label: t("following"),
      icon: me_1,
      url: "/follow",
      pageType: "following",
      badge: loginForm.followings_count,
    },
    {
      label: t("followers"),
      icon: me_2,
      url: "/follow",
      pageType: "fans",
      badge: loginForm.fans_count,
      isNew: false, // If this item is updated
    },
    {
      label: t("NotificationsPageTitle"),
      icon: me_3,
      url: "/notifications",
      badge: 0,
      isBg: true, // has backgroundcolor
    },
    {
      label: t("MyLikesPageTitle"),
      icon: me_4,
      url: "/myLikes",
    },
    {
      label: t("posts"),
      icon: me_5,
      url: "/myPosts",
    },
    {
      label: t("MyNFTPageTitle"),
      icon: me_7,
      url: "/NFT",
    },
  ]);

  useEffect(() => {

    setLoginForm(selector.loginForm);
    settoken(selector.token);

    list[1].isNew = !!selector.loginForm.new_fans_count;
    list[1].badge = selector.loginForm.fans_count;
    list[0].badge = selector.loginForm.followings_count;

  }, [selector]); // eslint-disable-line react-hooks/exhaustive-deps

  const [flag, setflag] = useState(false);
  const [loading, setloading] = useState(true);
  const [misesLoading, setmisesLoading] = useState(true);
  const [loadingMisesTxt, setloadingMisesTxt] = useState("Loading Mises");

  const [bonusesCount, setbonusesCount] = useState(0)
  useEffect(() => {
    if(selector.token) {
      fetchBonusCount().then(res => {
        setbonusesCount(BigNumber(res.bonus).decimalPlaces(2, BigNumber.ROUND_DOWN).toString())
      })
    }
  }, [selector.token])

  let timer;
  const getMisesAccountStatus = async () => {
    try {
      if (selector.web3Status && !selector.token) {

        const hasAccount = await window.mises.getMisesAccounts()
        console.log(hasAccount)
        // const hasAccount = await misesWeb3Client.hasWalletAccount();
  
        setflag(hasAccount);
        setmisesLoading(false);
        setloadingMisesTxt("Loading Mises")
        clearTimeout(timer);
        timer = null;
      } else {
        setmisesLoading(true);
  
        if(!timer){
          timer = setTimeout(() => {
            setloadingMisesTxt('Injecting Mises Wallet')
          }, 2000);
        }
      }
    } catch (error) {
      // seterrorText(error.toString())
      store.dispatch(setWeb3ProviderMaxFlag(false));
    }
  };

  useEffect(() => {
    if (token) setloading(false);
  }, [token]);
  useEffect(() => {
    getMisesAccountStatus();
    if(selector.web3Status){
      setloading(false);
    }
    // eslint-disable-next-line
  }, [selector.web3Status]);
  useEffect(() => {
    if(!selector.web3ProviderFlag){
      setTimeout(() => {
        setloading(false);
      }, 100);
    }
    // eslint-disable-next-line
  }, [selector.web3ProviderFlag]);

  useEffect(() => {
    list[2].badge = selector.badge.notifications_count > 99 ? '99+' : selector.badge.notifications_count;
    setTabList([...list]);
  }, [selector.badge]); // eslint-disable-line react-hooks/exhaustive-deps

  const onclick = async () => {
    const provider = await window.mises.getProvider();
    console.log(provider)
    // provider.getKey('mainnet')
    provider.enable && await provider.enable('mainnet');
    window.mises
      .requestAccounts()
      .then(() => {
        // window.location.reload();
      })
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
  /* 
  ,
    {
      label: t("blackListPageTitle"),
      icon: me_6,
      url: "/blackList",
    } */
  //router to userInfo
  const userInfo = () => history.push("/userInfo");
  //click global cell
  const cellClick = (val) =>
    history.push({
      pathname: val.url,
      search: objToUrl({ pageType: val.pageType }),
    });
  const connectView = () => {
    return (
      <div>
        <div>
          <p className="tips-title m-margin-top15 m-colors-333">
            {t("aboutId")}
          </p>
          <p className="m-font15 m-colors-333  m-tips me-tips">
            {t("connectMisesIdTips")}
          </p>
        </div>
        <div className="m-margin-lr40  m-margin-top10 m-margin-bottom20">
          <Button block shape="round" theme="primary" onClick={onclick}>
            <span className="btn-txt">{t("loginUser")}</span>
          </Button>
        </div>
      </div>
    );
  };
  const created = () => {
    return (
      <div>
        <div>
          <p className="tips-title m-margin-top15 m-colors-333">
            {t("aboutId")}
          </p>
          <p className="m-font15 m-colors-333 m-tips me-tips">
            {t("connectMisesIdTips")}
          </p>
          <p className="tips-title m-margin-top15 m-colors-333">
            {t("restoreTitle")}
          </p>
          <p className="m-font15 m-colors-333 me-tips m-tips">
            {t("resoreMisesIdTips")}
          </p>
        </div>
        <div className="m-margin-lr40 m-margin-top10 m-margin-bottom20">
          <Button block shape="round" theme="primary" onClick={onclick}>
            <span className="btn-txt">{t("createId")}</span>
          </Button>
        </div>
        {/* <p className="m-font15 m-colors-333 me-tips m-tipss">
        {t("createMisesIdTips")}
      </p>
      <div className="m-margin-lr40 m-margin-top10 m-margin-bottom20">
        <Button block shape="round" theme="primary" onClick={onclick}>
          <span className="btn-txt">{t("createId")}</span>
        </Button>
      </div> */}
      </div>
    );
  };
  const misesLoadingView = () => {
    return (
      selector.web3ProviderFlag ? (
        <div>
          <div className="loadingMises">{loadingMisesTxt}</div>
          <div className="loadingProgress">
            <div className="progressStatus"></div>
          </div>
        </div>
      ) : (
        <div className={`refreshBox ${
          !selector.web3ProviderFlag ? "showRefresh" : ""
        }`}>
          <div className="loadingMises">
            <p>Loading timed out</p>
            <p className="loadingMises-refreshTxt">Please try again later</p>
          </div>
          <div
            className="refreshBtn"
            onClick={refreshBtn}
          >
            <UndoOutline />
            <span className="refreshBtnTxt">Refresh</span>
          </div>
        </div>
      )
    );
  };
  const refreshBtn = () => {
    if (!selector.web3ProviderFlag) {
      window.location.reload();
    }
  };

  const Bonuses = memo(() => {
    
    return <div className="bonuses-container">
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><path d="M640 224c19.2 0 38.4 9.6 51.2 25.6l118.4 156.8c19.2 25.6 16 57.6-3.2 80l-246.4 275.2c-22.4 25.6-64 28.8-89.6 6.4-3.2 0-3.2-3.2-3.2-3.2l-249.6-275.2c-19.2-22.4-22.4-57.6-3.2-83.2l118.4-156.8c12.8-16 32-25.6 51.2-25.6h256z m0 64h-256l-118.4 156.8 246.4 275.2 246.4-275.2L640 288z m-32 96c19.2 0 32 12.8 32 32s-12.8 32-32 32h-192c-19.2 0-32-12.8-32-32s12.8-32 32-32h192z" fill="#333333" data-spm-anchor-id="a313x.search_index.0.i0.72cd3a81Rm0qVB"></path></svg>
      <div className="flex-1 right-content">
        <p className="bonuses-title">My Reward Points</p>
        <p className="mb-10 bonuses-value">{bonusesCount}</p>
      </div>
      <div className="flex align-center">
        <AntdButton type="button" color="primary" shape="rounded" size="small" onClick={() => {
          window.open('https://mining.test.mises.site/bonuses','target=_blank');
        }}>
          Redeem
        </AntdButton>
      </div>
    </div>
  }, () => false)
  const myselfView = () => {
    return (
      <div className="m-layout">
        <div className="m-padding-lr15 m-margin-top10  m-bg-fff">
          <Cell
            icon={<Avatar avatarItem={loginForm.avatar} size="60px"/>}
            label={username(loginForm)}
            labelStyle={{ fontSize: "23px", fontWeight: "bold" }}
            onPress={userInfo}
          />
          <Bonuses />
          {list.map((val, index) => (
            <Cell
              shape="square"
              showLine={false}
              icon={val.icon}
              iconSize={20}
              key={index}
              label={
                val.isNew ? <Badge shape="dot">{val.label}</Badge> : val.label
              }
              rightChild={
                val.badge ? (
                  val.isBg ? (
                    <Badge shape="round" text={val.badge}></Badge>
                  ) : (
                    <span className="right-badge">{val.badge}</span>
                  )
                ) : (
                  <span></span>
                )
              }
              onPress={() => cellClick(val)}
            ></Cell>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <ActivityIndicator type="spinner" />
        </div>
      ) : token ? (
        myselfView()
      ) : (
        <div className="m-layout m-bg-fff">
          <img alt="bg" src={bg} className="bg" />
          {misesLoading ? misesLoadingView() : flag ? connectView() : created()}
        </div>
      )}
    </div>
  );
};
export default Myself;
