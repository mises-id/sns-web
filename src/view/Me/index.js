/*
 * @Author: lmk
 * @Date: 2021-07-08 15:08:05
 * @LastEditTime: 2022-01-21 11:52:04
 * @LastEditors: lmk
 * @Description:
 */
import React, { useEffect, useState } from "react";
import "./index.scss";
import { useTranslation } from "react-i18next";
import me_1 from "@/images/me_1.png";
import me_2 from "@/images/me_2.png";
import me_3 from "@/images/me_3.png";
import me_4 from "@/images/me_4.png";
import me_5 from "@/images/me_5.png";
import me_6 from "@/images/me_6.png";
import Cell from "@/components/Cell";
import { ActivityIndicator, Badge, Button } from "zarm";
import { useSelector } from "react-redux";
import bg from "@/images/me-bg.png";
import { objToUrl, username } from "@/utils";
const Myself = ({ history }) => {
  const { t } = useTranslation();
  const [loginForm,setLoginForm] = useState({});
  const [token, settoken] = useState('')
   // eslint-disable-next-line
  const selector = useSelector((state) => state.user) || {};
  useEffect(() => {
    setLoginForm(selector.loginForm)
    settoken(selector.token)
    list[1].isNew = !!selector.loginForm.new_fans_count;
    list[1].badge = selector.loginForm.fans_count;
    list[0].badge = selector.loginForm.followings_count;
  }, [selector]) // eslint-disable-line react-hooks/exhaustive-deps
  const [flag, setflag] = useState(false);
  const [loading, setloading] = useState(true);
  //getData
  const getFlag = async () => {
    try {
      // if (!token) {
      //   const count = await window.mises.getMisesAccounts();
      //   setflag(count > 0);
      // }
      setloading(false);
      cleartimer()
    } catch (error) {
      setflag(false);
      setloading(false);
      cleartimer()
    }
  };
  let timer = null;
  const cleartimer = ()=>{
    clearTimeout(timer);
    timer = null;
  }
  useEffect(() => {
    window.mises.getAddAccountFlag().then(res=>{
      console.log(res);
    })
    if(timer){
      cleartimer()
    }
    // eslint-disable-next-line
    timer = setTimeout(() => {
      setflag(false);
      setloading(false);
    }, 1000);
    return () => {
      cleartimer()
    }
  }, [])
  useEffect(() => {
    getFlag();
  }, [token]);// eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    list[2].badge = selector.badge.notifications_count;
    setTabList([...list])
  }, [selector.badge]); // eslint-disable-line react-hooks/exhaustive-deps
  const onclick = () => {
    window.mises.requestAccounts().catch(err=>{
      // Toast.show(err||err.message)
      
    })
  };
  const restore = () => {
    window.mises.openRestore().catch(err=>{
      // Toast.show(err||err.message)
    });
  }
  const [list,setTabList] = useState([
    {
      label: t("following"),
      icon: me_1,
      url: "/follow",
      pageType: "following",
      badge:loginForm.followings_count
    },
    {
      label: t("followers"),
      icon: me_2,
      url: "/follow",
      pageType: "fans",
      badge:loginForm.fans_count,
      isNew:false // If this item is updated
    },
    {
      label: t("NotificationsPageTitle"),
      icon: me_3,
      url: "/notifications",
      badge:0,
      isBg:true // has backgroundcolor
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
      label: t("blackListPageTitle"),
      icon: me_6,
      url: "/blackList",
    }
  ]);
  //router to userInfo
  const userInfo = () => history.push("/userInfo");
  //click global cell
  const cellClick = (val) =>
    history.push({ pathname: val.url, search: objToUrl({ pageType: val.pageType }) });
  return (
    <div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <ActivityIndicator type="spinner" />
        </div>
      ) : token ? (
        <div className="m-layout">
          <div className="m-padding-lr15 m-margin-top10  m-bg-fff">
            <Cell
              iconSize={60}
              icon={loginForm.avatar && loginForm.avatar.medium}
              label={username(loginForm)}
              labelStyle={{ fontSize: "23px", fontWeight: "bold" }}
              onPress={userInfo}
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
                  val.badge ? (val.isBg ? <Badge shape="round" text={val.badge}></Badge> : <span className="right-badge">{val.badge}</span>) : <span></span>
                }
                onPress={() => cellClick(val)}
              ></Cell>
            ))}
          </div>
        </div>
      ) : (
        <div className=" m-layout m-bg-fff">
          <img alt="bg" src={bg} className="bg" />
          <div className="m-margin-left15 m-margin-bottom25">
            <p className="nickname m-margin-top15 m-margin-bottom20 m-colors-333">
              {t("aboutId")}
            </p>
            <p className="m-font15 m-colors-333 m-margin-top8 m-padding-right24 m-tips">
              {t("createMisesIdTips")}{" "}
            </p>
          </div>
          <div className="m-margin-lr40">
            <div className="m-padding-top25">
              <Button block shape="round" theme="primary" onClick={onclick}>
                {t(flag ? "loginUser" : "createId")}
              </Button>
            </div>
            <div className="m-padding-top25">
              <Button
                block
                shape="round"
                theme="primary"
                ghost
                onClick={restore}
              >
                {t("restore")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Myself;
