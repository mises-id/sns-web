/*
 * @Author: lmk
 * @Date: 2021-07-10 16:12:04
 * @LastEditTime: 2022-04-06 12:49:31
 * @LastEditors: lmk
 * @Description:
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Tabs } from "zarm";
import send from "@/images/send.png";
import "./index.scss";
import Image from "@/components/Image";
import { getUserSelfInfo } from "@/api/user";
import { useDispatch, useSelector } from "react-redux";
import { setFirstLogin, setLoginForm, setUserAuth } from "@/actions/user";
import { urlToJson } from "@/utils";
import { useDidRecover } from "react-router-cache-route";
const { Panel } = Tabs;
const Home = ({ history, children = [] }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState([
    { path: "/home/following", text: t("follow"), badge: 0 },
    { path: "/home/discover", text: t("discover") },
    { path: "/home/me", text: t("me") },
  ]);
  const [value, setvalue] = useState(localStorage.getItem('tabIndex') || 0);
  const dispatch = useDispatch();
  const setTabActive = () => {
    const { pathname } = window.location;
    //get hostname to set tabIndex
    // const path = pathname;
    let index = 0
    switch (pathname) {
      case "/home/following":
        index = 0;
        break;
      case "/home/discover":
        index = 1;
        break;
      default:
        getUserInfo();
        index = 2;
        break;
    }
    setvalue(index);
    localStorage.setItem('tabIndex',index);
    const { mises_id, nonce, sig } = urlToJson();
    if (mises_id && nonce && sig) {
      const auth = `mises_id=${mises_id}&nonce=${nonce}&sig=${sig}`;
      dispatch(setUserAuth(auth));
    }
  };
  const user = useSelector((state) => state.user) || {};
  const { auth, token, badge = {} } = user;
  useEffect(() => {
    getUserInfo()
  }, [auth, token]); // eslint-disable-line react-hooks/exhaustive-deps
  const getUserInfo = () => {
    if (auth && token) {
      return getUserSelfInfo().then((res) => {
        dispatch(setLoginForm(res));
        localStorage.setItem('uid',res.uid);
        setTimeout(() => {
          if(!res.is_logined&&history.location.pathname!=='airdrop'){
            history.push('/airdrop')
            dispatch(setFirstLogin(true))
          }
        }, 100);
      }).catch(res=>{
        console.log(res,'getUserInfo')
      });
    }
    return Promise.resolve()
  };
  useDidRecover(() => {
    window.getCachingKeys().forEach(res=>{
      if(['/home'].includes(res)){
        console.log(res)
        window.refreshByCacheKey(res);
      }
    })
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
  const getAirdrop = ()=>{
    history.push('/airdrop?isFrom=homePage')
  }
  //Show current route
  const showChild = (path) =>
    children.find((val) => val.key === path) || <div></div>;
  return (
    <>
      <Tabs value={value} onChange={getChange} lineWidth={10} swipeable={false}>
        {tab.map((val, index) => (
          <Panel
            key={val.path}
            title={
              <>
                <span className={value === index ? "active" : "unactive"}>
                  {val.text}
                </span>
                {val.badge > 0 && (
                  <Badge shape="circle" className="badge" text={val.badge} />
                )}
              </>
            }
          >
            {showChild(val.path)}
          </Panel>
        ))}
      </Tabs>
      {token && (
        <div className="m-position-fixed createPosts">
          <Image
            size={75}
            alt="posts"
            onClick={createPosts}
            source={send}
            shape="square"
          ></Image>
          <div className="airdrop" onClick={getAirdrop}>Airdrop</div>
        </div>
      )}
    </>
  );
};
export default Home;
