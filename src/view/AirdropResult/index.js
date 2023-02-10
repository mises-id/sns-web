/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-11-15 11:02:09
 * @LastEditors: lmk
 * @Description: createPosts page
 */
import Navbar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { getAirdropInfo, getTwitterAuth } from "@/api/user";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Image } from "antd-mobile";
import { shortenAddress } from "@/utils";
import { useSelector } from "react-redux";
const AirdropResult = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [status, setStatus] = useState(""); // success, fail , unauth
  const [airdropInfo, setAirdropInfo] = useState({});
  useEffect(() => {
    const search = new URLSearchParams(location.search);
    // code : 0 1 2
    if (search.get("code") !== "2") {
      // const res = {
      //   "twitter": {
      //     "twitter_user_id": "1461679761202286597",
      //     "misesid": "mises17z5t4lkd2vvv5f8ggggf7zvmxmsgz2mxx4nyv6",
      //     "name": "chen guo",
      //     "username": "vim_guo",
      //     "check_state": "invalid",
      //     "invalid_code": "invalid",
      //     "reason": "This Account was created after May. 1, 2022",
      //     "followers_count": 11,
      //     "tweet_count": 1,
      //     "twitter_created_at": "2022-11-19T20:56:36+08:00",
      //     "amount": 1.004,
      //     "created_at": "2022-06-15T10:37:37+08:00"
      //   },
      // }
      getAirdropInfo().then((res) => {
        // if(!res.twitter && !res.airdrop){
        //   history.replace('/airdrop?isFrom=homePage')
        // }
        setAirdropInfo(
          res.twitter || {
            username: search.get("username"),
            misesid: search.get("misesid"),
          }
        );
        setStatus(setViewStatus(search, res));
      });
    } else {
      setStatus("unauth");
    }
    // eslint-disable-next-line
  }, []);
  const setViewStatus = (search, res) => {
    if (res.airdrop && ["success","default"].includes(res.airdrop.status)) {
      return "gotMIS";
    }
    if (res.airdrop) {
      return "unGotMIS";
    }
    if(res.twitter){
      // wait for airdrop or fail
      return res.twitter.check_state === "valid" ? "unGotMIS" : res.twitter.check_state
    }
    if (search.get("code") === "1") {
      return "fail";
    }
    return "timeFail";
  };
  const history = useHistory();
  const customBack = () => {
    history.replace("/home/me");
  };
  // const [getValue, setValue] = useState('')
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
  const statusTxt = () => {
    const statusObj = {
      fail: "This Twitter account has been verified with another Mises ID",
      timeFail: "This Account was created after May. 1, 2022",
      followers_countError: "Insufficient social data in this Twitter account",
      unauth: "Sorry, you canceled the authorization!",
      gotMIS:
        "This Twitter Account has got the MIS Airdrop, Thanks for your support!",
      unGotMIS:
        "You have successfully claimed your MIS Airdrop, Airdroping could take a few minutes.",
    };
    if (statusObj[status]) {
      return statusObj[status];
    }
    return statusObj["unauth"];
  };
  const selector = useSelector((state) => state.user) || {};
  const misesid = (
    airdropInfo?.misesid ||
    selector.loginForm?.misesid ||
    ""
  ).replace("did:mises:", "");

  // const unEditText = `I have claimed $MIS airdrop by using Mises Browser @Mises001, which supports Web3 sites and extensions on mobile.<br/><br/>https://www.mises.site/download?MisesID=${misesid}<br/><br/>#Mises #Browser #web3 #extension`

  const SuccessLayout = () => {
    if (status === "pending") {
      return (
        <>
          <Image src="/static/images/hourglass.png" className="hourglass" />
          <p className="waiting">Reviewing your eligibility for the</p>
          <p className="waiting">airdrop, please wait</p>
          <p className="criterion">Standard of criterion: your Twitter data</p>
          <div className="success-misesid">
            <span className="misesid-title">Mises ID:</span>
            <span>{shortenAddress(misesid)}</span>
          </div>
          <p className="font-14 airdrop-tips">
            If your account is eligible, you will automatically follow @mises001 , 
            like and retweet a post to claim the airdrop
          </p>
          <a
            className="remove-twitter-auth"
            target="_blank"
            href="https://twitter.com/settings/connected_apps"
            rel="noreferrer"
          >
            Cancel Twitter authorization to abandon the airdrop
          </a>
          <Button
            className="btn"
            fill="solid"
            color="primary"
            onClick={customBack}
          >
            <span>Confirm</span>
          </Button>
        </>
      );
    }
    return null;
  };

  const FailLayout = () => {
    if (status !== "pending" && status !== "") {
      return (
        <>
          <div className="listItem">
            <span className="label">Mises ID:</span>
            <span className="value">{shortenAddress(misesid)}</span>
          </div>
          {airdropInfo.username && (
            <div className="listItem">
              <span className="label">Twitter ID:</span>
              <span className="value">{airdropInfo.username}</span>
            </div>
          )}
          {!["gotMIS", "unGotMIS"].includes(status) ? (
            <>
              {status !== "unauth" && (
                <p className="fail-reason">
                  Your account does not meet the requirements
                </p>
              )}
              <p className="fail-reason">
                {status !== "unauth" && <span>Reason:</span>} {airdropInfo.reason || statusTxt()}
              </p>
              <Button
                className="btn-fail"
                fill="outline"
                color="primary"
                loading={loading}
                onClick={getAuth}
              >
                <span>Change Twitter</span>
              </Button>
            </>
          ) : (
            <p className="get-airdrop-reason">{statusTxt()}</p>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <>
      <Navbar title={t("airdropPageTitle")} customBack={customBack} />
      <div
        className="m-layout airdrop-content"
        style={{ backgroundImage: "url(/static/images/airdrop-bg.png)" }}
      >
        <div className="airdrop-box">
          <SuccessLayout />
          <FailLayout />
        </div>
      </div>
    </>
  );
};
export default AirdropResult;
