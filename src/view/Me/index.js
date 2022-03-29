/*
 * @Author: lmk
 * @Date: 2021-07-08 15:08:05
 * @LastEditTime: 2022-03-29 16:10:13
 * @LastEditors: lmk
 * @Description:
 */
import React, { useEffect, useState } from "react";
import "./index.scss";
import { UndoOutline } from "antd-mobile-icons";
import { useTranslation } from "react-i18next";
import me_1 from "@/images/me_1.png";
import me_2 from "@/images/me_2.png";
import me_3 from "@/images/me_3.png";
import me_4 from "@/images/me_4.png";
import me_5 from "@/images/me_5.png";
// import me_6 from "@/images/me_6.png";
import Cell from "@/components/Cell";
import { ActivityIndicator, Badge, Button, Modal } from "zarm";
import { useSelector } from "react-redux";
import bg from "@/images/me-bg.png";
import { objToUrl, username } from "@/utils";

const Myself = ({ history }) => {
  const { t } = useTranslation();
  const [loginForm, setLoginForm] = useState({});
  const [token, settoken] = useState("");
  // eslint-disable-next-line
  const selector = useSelector((state) => state.user) || {};
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

  let timer;
  const getMisesAccountFlag = () => {
    if (selector.web3Status && !selector.token) {
      window.mises &&
        window.mises.getMisesAccounts(true).then((res) => {
          setflag(!!res);
          setmisesLoading(false);
          setloadingMisesTxt("Loading Mises")
          clearTimeout(timer);
          timer = null;
        }).catch(err=>{
          console.log(err)
        });
    } else {
      // setflag(false)
      setmisesLoading(true);
      if(!timer){
        timer = setTimeout(() => {
          setloadingMisesTxt('Injecting Metamask')
        }, 2000);
      }
    }
  };

  useEffect(() => {
    if (token) setloading(false);
  }, [token]);
  useEffect(() => {
    getMisesAccountFlag();
    setloading(false);
    // eslint-disable-next-line
  }, [selector.web3Status]);

  useEffect(() => {
    list[2].badge = selector.badge.notifications_count;
    setTabList([...list]);
  }, [selector.badge]); // eslint-disable-line react-hooks/exhaustive-deps

  const onclick = () => {
    window.mises
      .requestAccounts()
      .then((res) => {
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
  ]);
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
  // const getAirdrop = (e)=>{
  //   e.stopPropagation()
  //   history.push(loginForm.is_airdropped ? '/airdropSuccess':`/airdrop?isFrom=homePage`)
  // }
  const myselfView = () => {
    return (
      <div className="m-layout">
        <div className="m-padding-lr15 m-margin-top10  m-bg-fff">
          <Cell
            iconSize={60}
            icon={loginForm.avatar && loginForm.avatar.medium}
            label={username(loginForm)}
            labelStyle={{ fontSize: "23px", fontWeight: "bold" }}
            onPress={userInfo}
            // subTitle={loginForm.airdrop_status ? <div onClick={getAirdrop} className="getAirdrop">
            //   <span>Get Airdrop</span>
            //   <RightOutline fontSize={7}/>
            // </div> : ''}
          />
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
