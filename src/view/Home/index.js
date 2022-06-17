/*
 * @Author: lmk
 * @Date: 2021-07-10 16:12:04
 * @LastEditTime: 2022-06-17 16:07:18
 * @LastEditors: lmk
 * @Description:
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import send from "@/images/send.png";
import "./index.scss";
import { getUserSelfInfo } from "@/api/user";
import { useDispatch, useSelector } from "react-redux";
import { setFirstLogin, setLoginForm, setUserAuth } from "@/actions/user";
import { urlToJson } from "@/utils";
import { useDidRecover } from "react-router-cache-route";
import { Tabs, Badge, Image } from "antd-mobile";
const Home = ({ history, children = [] }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState([
    { path: "/home/following", text: t("follow"), badge: 0 },
    { path: "/home/discover", text: t("discover") },
    { path: "/home/recent", text: t("recent") },
    { path: "/home/me", text: t("me") },
  ]);
  const [value, setvalue] = useState(localStorage.getItem("tabIndex") || '1');
  const dispatch = useDispatch();
  const setTabActive = () => {
    const { pathname } = window.location;
    //get hostname to set tabIndex
    // const path = pathname;
    let index = 0;
    switch (pathname) {
      case "/home/following":
        index = 0;
        break;
      case "/home/discover":
        index = 1;
        break;
      case "/home/recent":
        index = 2;
        break;
      default:
        getUserInfo();
        index = 3;
        break;
    }
    setvalue(`${index}`);
    localStorage.setItem("tabIndex", `${index}`);
    const { mises_id, nonce, sig } = urlToJson();
    if (mises_id && nonce && sig) {
      const auth = `mises_id=${mises_id}&nonce=${nonce}&sig=${sig}`;
      dispatch(setUserAuth(auth));
    }
  };
  const user = useSelector((state) => state.user) || {};
  const { auth, token, badge = {} } = user;
  useEffect(() => {
    getUserInfo().catch((err) => {
      console.log(err);
    });
  }, [auth, token]); // eslint-disable-line react-hooks/exhaustive-deps
  const getUserInfo = () => {
    if (auth && token) {
      return getUserSelfInfo()
        .then((res) => {
          dispatch(setLoginForm(res));
          localStorage.setItem("uid", res.uid);
          setTimeout(() => {
            if (!res.is_logined && history.location.pathname !== "airdrop") {
              history.push("/airdrop");
              dispatch(setFirstLogin(true));
            }
          }, 100);
        })
        .catch((res) => {
          console.log(res, "getUserInfo");
        });
    }
    return Promise.resolve();
  };
  useDidRecover(() => {
    window.getCachingKeys().forEach((res) => {
      if (
        ![
          "/home",
          "/home/discover",
          "/home/following",
          "/home/recent",
        ].includes(res)
      ) {
        console.log(res);
        window.refreshByCacheKey(res);
      }
    });
  });
  useEffect(() => {
    document.body.style.overflow = "hidden";
    setTabActive();
    const listen = history.listen(setTabActive);
    return () => {
      document.body.style.overflow = "auto";
      listen();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    tab[0].badge = badge.total;
    setTab([...tab]);
  }, [badge.total]); // eslint-disable-line react-hooks/exhaustive-deps
  //change current and change route
  const getChange = (val) => {
    setvalue(val);
    const path = tab[val];
    history.push(path.path);
  };
  const createPosts = () => {
    history.push({ pathname: "/createPosts" });
  };
  const getAirdrop = () => {
    history.push(user.loginForm.airdrop_status ? '/airdropSuccess' : "/airdrop?isFrom=homePage");
  };
  //Show current route
  const showChild = (path) =>
    children.find((val) => val.key === path) || <div></div>;
  return (
    <>
      <div>
        <Tabs
          activeLineMode="fixed"
          activeKey={value}
          onChange={getChange}
          style={{ "--content-padding": 0 }}
        >
          {tab.map((val, index) => (
            <Tabs.Tab
              title={
                val.badge > 0 ? (
                  <Badge
                    content={val.badge}
                    style={{ "--right": "-10px", "--top": "8px" }}
                  >
                    <span
                      className={value === `${index}` ? "active" : "unactive"}
                    >
                      {val.text}
                    </span>
                  </Badge>
                ) : (
                  <span className={value === `${index}` ? "active" : "unactive"}>
                    {val.text}
                  </span>
                )
              }
              key={index}>{showChild(val.path)}</Tabs.Tab>
          ))}
        </Tabs>
      </div>
      {token && (
        <div className="m-position-fixed createPosts">
          <Image width={75} height={75} src={send} onClick={createPosts}/>
          <div className="airdrop" onClick={getAirdrop}>
            Airdrop
          </div>
        </div>
      )}
    </>
  );
};
export default Home;
