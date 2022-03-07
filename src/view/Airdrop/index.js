/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-03-07 15:17:12
 * @LastEditors: lmk
 * @Description: Airdrop page
 */
import { shareTwitter } from "@/api/user";
import Navbar from "@/components/NavBar";
import { useRouteState } from "@/utils";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "zarm";
import "./index.scss";
const Airdrop = () => {
  const { t } = useTranslation();
  const [showSkip, setShowSkip] = useState(false)
  const historyState = useRouteState();
  useEffect(() => {
    setShowSkip(historyState.isFrom!=='homePage')
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
          window.history.back();
        },
      });
    })
  };
  return (
    <div>
      <Navbar title={t("airdropPageTitle")} rightChild={showSkip ? <div className="skip">Skip</div> : ''} />
      <div className="m-layout m-bg-fff m-padding15 m-font18">
        <p className="airdrop-title">{t("airdropContentTitle")}</p>
        <p className="airdrop-title">{t("airdropContentTitle2")}</p>
        <p className="toClaim">{t("toClaim")}:</p>
        <p className="desc-item">{t("airdropContentdesc")}</p>
        <p className="desc-item">{t("airdropContentdesc1")}</p>
        <p className="desc-item">{t("airdropContentdesc2")}</p>
        <div className="sendTweet">
          <Button block shape="round" theme="primary" onClick={sendTweet}>
            <span className="btn-txt">{t("sendTweet")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Airdrop;
