/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-06-20 11:03:52
 * @LastEditors: lmk
 * @Description: Airdrop page
 */
import { getTwitterAuth } from "@/api/user";
import Navbar from "@/components/NavBar";
import { useRouteState } from "@/utils";
import { Button } from "antd-mobile";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";
const Airdrop = () => {
  const { t } = useTranslation();
  const [showSkip, setShowSkip] = useState(false);
  const historyState = useRouteState();
  const [MIS, setMIS] = useState(0);
  useEffect(() => {
    const flag = historyState.isFrom !== "homePage";
    setShowSkip(flag);
    setMIS(historyState.MIS)
    const isRefresh = sessionStorage.getItem("isRefresh");
    if (flag && !isRefresh) {
      sessionStorage.setItem("isRefresh", true);
      window.location.reload();
    }
    return () => {
      
    };
    // eslint-disable-next-line
  }, []);
  const [loading,setLoading] = useState(false)
  const getAuth = () => {
    getTwitterAuth()
      .then((res) => {
        window.location.href = res.url;
      })
      .catch((err) => {
        console.log(err);
      }).finally(()=>{
        setLoading(false)
      });
  };
  const skip = () => {
    window.history.back();
  };
  return (
    <div>
      <Navbar
        title={t("airdropPageTitle")}
        rightChild={
          showSkip ? (
            <div className="skip" onClick={skip}>
              Skip
            </div>
          ) : (
            ""
          )
        }
      />
      <div className="airdrop-bg m-font18">
        <div className="layout-box">
          <img
            src="/static/images/background.png"
            alt=""
            className="background"
          />
          <div className="layout-content">
            <img
              src="/static/images/title.png"
              alt=""
              className="airdrop-title"
            />
            <div className="toClaim-box">
              <img
                src="/static/images/parachute.png"
                alt=""
                className="airdrop-parachute"
              />
              <div className="toClaim-content">
                {MIS>0 ? <>
                  <p className="claimedMis">{`You have successfully claimed ${MIS}MIS`}</p>
                  <p className="desc-item">
                    Airdropping... This process could take a few minutes
                    <img
                      src="/static/images/circle.png"
                      alt=""
                      className="circle"
                    />
                  </p>
                  <div className="sendTweet">
                    <Button fill="solid" type="primary"
                    onClick={skip} className="airdrop-btn">
                      <span className="airdrop-btn-txt">Confirm</span>
                    </Button>
                  </div>
                </> : <>
                  <p className="toClaim">{t("toClaim")}:</p>
                  <p className="desc-item">
                    {t("airdropContentdesc")}
                    <img
                      src="/static/images/circle.png"
                      alt=""
                      className="circle"
                    />
                  </p>
                  <p className="desc-item">
                    {t("airdropContentdesc1")}
                    <img
                      src="/static/images/circle.png"
                      alt=""
                      className="circle"
                    />
                  </p>
                  <div className="sendTweet">
                    <Button fill="solid" type="primary"
                    loading={loading}
                    onClick={getAuth} className="airdrop-btn">
                      <span className="airdrop-btn-txt">{t("sendTweet")}</span>
                    </Button>
                  </div>
                </>}
                
                <img
                  src="/static/images/ribbon.png"
                  alt=""
                  className="ribbon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Airdrop;
