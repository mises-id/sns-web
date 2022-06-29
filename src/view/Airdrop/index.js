/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-06-29 10:29:47
 * @LastEditors: lmk
 * @Description: Airdrop page
 */
import { getAirdropInfo, getTwitterAuth } from "@/api/user";
import Navbar from "@/components/NavBar";
import { useRouteState } from "@/utils";
import { Button } from "antd-mobile";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDidRecover } from "react-router-cache-route";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { ActivityIndicator } from "zarm";
import "./index.scss";
const Airdrop = () => {
  const { t } = useTranslation();
  const [showSkip, setShowSkip] = useState(false);
  const historyState = useRouteState();
  const [MIS, setMIS] = useState(0);
  const history = useHistory();
  const [pageLoading, setPageLoading] = useState(true);
  useDidRecover(() => {
    window.refreshByCacheKey("/airdrop");
  });
  const init = () => {
    const flag = historyState.isFrom === "homePage";
    setShowSkip(!flag);
    setMIS(historyState.MIS);
    const isRefresh = sessionStorage.getItem("isRefresh");
    if (!flag && !isRefresh) {
      sessionStorage.setItem("isRefresh", true);
      window.location.reload();
    }
    if (flag && MIS === 0) {
      getAirdropInfo()
        .then((res) => {
          if (res.airdrop) {
            let url = null;
            const { status, coin } = res.airdrop;
            switch (status) {
              case "default":
                url = `/airdrop?isFrom=homePage&MIS=${coin}`;
                break;
              case "success":
                url = "/airdropSuccess";
                break;
              case "failed":
                url = "/airdropResult?code=1";
                break;
              default:
                // url="/airdrop?isFrom=homePage"
                break;
            }
            setPageLoading(false);
            url && history.replace(url);
            return;
          }else{
            setPageLoading(false);
          }
        })
        .catch((err) => {});
    } else {
      setPageLoading(false);
    }
  };
  useEffect(() => {
    init();
    return () => {
      setMIS(0);
    };
    // eslint-disable-next-line
  }, []);
  const [loading, setLoading] = useState(false);
  const getAuth = () => {
    setLoading(true);
    getTwitterAuth()
      .then((res) => {
        window.location.href = res.url;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const skip = () => {
    window.history.back();
  };
  const {loginForm} = useSelector(state=>state.user)
  const inviteFriends = () => {
    history.push(`/myInvitation?misesId=${loginForm.misesid}`);
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
      {!pageLoading ? (
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
                  {MIS > 0 ? (
                    <>
                      <p className="claimedMis">{`You have successfully claimed ${MIS}MIS`}</p>
                      <p className="desc-item">
                        Airdropping... This process could take a few minutes.
                        <img
                          src="/static/images/circle.png"
                          alt=""
                          className="circle"
                        />
                      </p>
                      <p className="desc-item">
                        Invite your friends to get more MIS!
                        <img
                          src="/static/images/circle.png"
                          alt=""
                          className="circle"
                        />
                      </p>
                      <div className="sendTweet">
                        <Button
                          fill="solid"
                          type="primary"
                          onClick={inviteFriends}
                          className="airdrop-btn"
                        >
                          <span className="airdrop-btn-txt">Invite Friends</span>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
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
                        <Button
                          fill="solid"
                          type="primary"
                          loading={loading}
                          onClick={getAuth}
                          className="airdrop-btn"
                        >
                          <span className="airdrop-btn-txt">
                            {t("sendTweet")}
                          </span>
                        </Button>
                      </div>
                    </>
                  )}

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
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <ActivityIndicator type="spinner" />
        </div>
      )}
    </div>
  );
};
export default Airdrop;
