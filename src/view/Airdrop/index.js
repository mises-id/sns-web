/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-03-23 17:03:39
 * @LastEditors: lmk
 * @Description: Airdrop page
 */
import { shareTwitter } from "@/api/user";
import Navbar from "@/components/NavBar";
import { useRouteState } from "@/utils";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "zarm";
import "./index.scss";
const Airdrop = () => {
  const { t } = useTranslation();
  const [showSkip, setShowSkip] = useState(false)
  const historyState = useRouteState();
  useEffect(() => {
    const flag = historyState.isFrom!=='homePage'
    setShowSkip(flag)
    if(flag) window.location.reload()
    // eslint-disable-next-line
  }, [])
  
  const sendTweet = () => {
    shareTwitter().then(res=>{
      window.open(res.url)
      Modal.confirm({
        title: "Message",
        content: "Please make sure you have sent your tweet already. ",
        width: "83%",
        onCancel: () => {},
        onOk: () => {
          skip()
        },
      });
    })
  };
  const skip = ()=>{
    window.history.back();
  }
  return (
    <div>
      <Navbar title={t("airdropPageTitle")} rightChild={showSkip ? <div className="skip" onClick={skip}>Skip</div> : ''} />
      <div className="airdrop-bg m-font18">
        <div className="layout-box">
          <img src="/static/images/background.png" alt="" className="background"/>
          <div className="layout-content">
            <img src="/static/images/title.png" alt="" className="airdrop-title"/>
            <div className="toClaim-box">
              <img src="/static/images/parachute.png" alt="" className="airdrop-parachute"/>
              <div className="toClaim-content">
                <p className="toClaim">{t("toClaim")}:</p>
                <p className="desc-item">
                  {t("airdropContentdesc")}
                  <img src="/static/images/circle.png" alt="" className="circle"/>
                </p>
                <p className="desc-item">
                  {t("airdropContentdesc1")}
                  <img src="/static/images/circle.png" alt="" className="circle"/>
                </p>
                <p className="desc-item">
                  {t("airdropContentdesc2")}
                  <img src="/static/images/circle.png" alt="" className="circle"/>
                </p>
                <div className="sendTweet">
                  <div onClick={sendTweet} className="airdrop-btn">
                    <span className="airdrop-btn-txt">{t("sendTweet")}</span>
                  </div>
                </div>
                <img src="/static/images/ribbon.png" alt="" className="ribbon"/>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
export default Airdrop;
