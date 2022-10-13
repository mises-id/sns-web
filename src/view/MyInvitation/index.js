/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-10-09 15:04:22
 * @LastEditors: lmk
 * @Description: Airdrop page
 */
import { getReferralList, getReferralUrl } from "@/api/user";
import Navbar from "@/components/NavBar";
import {
  Button,
  Grid,
  InfiniteScroll,
  List,
  PullToRefresh,
} from "antd-mobile";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// import { useLocation } from "react-router-dom";
import { Toast } from "zarm";
import "./index.scss";
const MyInvitation = () => {
  const { t } = useTranslation();
  const [info, setinfo] = useState({
    airdrop_amount: 0,
    total_channel_user: 0,
  });

  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const search = new URLSearchParams(window.location.search);
  const misesId = search.get("misesId")?.includes("did:mises:")
    ? search.get("misesId").replace("did:mises:", "")
    : search.get("misesId");
  useEffect(() => {
    if (misesId) {
      getInfo(misesId);
    }
    // eslint-disable-next-line
  }, []);
  const getInfo = async (misesId) => {
    try {
      const misesInfo = await getReferralUrl({
        misesId,
        medium: "invite",
      });
      setinfo({ ...misesInfo });
    } catch (error) {
      console.log(error);
      return await Promise.reject(error);
    }
  };
  const loadMore = async () => {
    if (isLoading || error) return;
    setIsLoading(true);
    setError(false);
    return fetchData()
      .then((res) => {
        setData([...data, ...res]);
        setPage(page + 1);
        setHasMore(res.length >= pageSize);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const onRefresh = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(false);
    setPage(1);
    setHasMore(true);
    fetchData(1)
      .then((res) => {
        setData([...res]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const pageSize = 20;
  const fetchData = async (pageNum) => {
    try {
      const res = await getReferralList({
        misesid: misesId,
        page_size: pageSize,
        page_num: pageNum || page,
      });
      const arr = res.data.map((val, index) => {
        // airdrop_state: 0 默认，1 正在处理 ， 2 空投成功，3 空投失败
        const misesId = val.user.misesid.replace("did:mises:", "");
        const misesStr = `${misesId.slice(0, 8)}******${misesId.slice(-4)}`;
        return {
          key: index,
          misesId: misesStr,
          airdrop_state: val.airdrop_state,
          created_at: dayjs(val.created_at).format("YYYY-MM-DD HH:mm:ss"),
          airdropState: val.airdrop_state === 2 ? "Complete" : "Incomplete",
        };
      });
      return Promise.resolve(arr);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const renderView = (val, index) => {
    return (
      <div className="table-body-item" key={index}>
        <Grid columns={2}>
          <Grid.Item>
            <div className="text-center table-header">{val.misesId}</div>
          </Grid.Item>
          <Grid.Item>
            <div className={`text-center table-header table-body-last ${val.airdrop_state===2 ? 'complete' : 'incomplete'}`}>
              {val.airdropState}
            </div>
          </Grid.Item>
        </Grid>
      </div>
    );
  };
  const share = ()=>{
    console.log(`${window.location.origin}/download?misesid=${misesId}`)
    if(!navigator.share){
      Toast.show('Browser cannot share website')
      return false;
    }
    navigator.share&&navigator.share({
      text: `Join me to use Mises Browser to start your #Web3 journey!\n\n#Mises #Browser #DeFi #NFT #SocialFi`,
      url: `${window.location.origin}/download?misesid=${misesId}`,
    }).catch(err=>{
      console.log(err)
    })
  }
  const history = useHistory()
  const customBack = ()=>{
    history.replace('/home/me')
  }
  return (
    <div>
      <Navbar title={t("myInvitationPageTitle")} customBack={customBack}/>
      <div className="m-layout">
        <div className="position-relative">
          <img
            alt=""
            src="/static/images/invite_bg@2x.png"
            width="100%"
            className="invite_bg"
          />
          <div className="position-absolute">
            <div className="text">
              <p>Invite your friends to join Mises, you </p>
              <p>can get 10% of your friends' </p>
              <p>airdrop rewards</p>
            </div>
            <div className="m-flex position-relative share-btn-box">
              <Button
                color="white"
                shape="rounded"
                size="large"
                className="m-flex-1"
                onClick={share}
              >
                <span className="share-btn">Share Mises to friends</span>
                <img
                  src="/static/images/arrow@2x.png"
                  alt=""
                  className="arrow"
                />
              </Button>
              <img
                src="/static/images/airdropIcon.png"
                alt=""
                className="airdropIcon"
              />
            </div>
          </div>
        </div>
        <div className="list">
          <p className="stas">
            Number of Invitation: {info.total_channel_user}
          </p>
          <p className="stas">
            Reward: <span>{info.airdrop_amount}</span> MIS{" "}
          </p>
          <div className="table-header-item">
            <Grid columns={2}>
              <Grid.Item>
                <div className="text-center table-header">Mises ID</div>
              </Grid.Item>
              <Grid.Item>
                <div className="text-center table-header table-header-last">
                  Status
                </div>
              </Grid.Item>
            </Grid>
          </div>
          <PullToRefresh onRefresh={onRefresh}>
            {data.length > 0 && (
              <List
                style={{ "--border-top": "none", "--border-bottom": "none" }}
              >
                {data.map(renderView)}
              </List>
            )}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
          </PullToRefresh>
        </div>
      </div>
    </div>
  );
};
export default MyInvitation;
