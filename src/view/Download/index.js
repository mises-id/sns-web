/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-04-15 15:40:19
 * @LastEditors: lmk
 * @Description: Airdrop page
 */
import { getReferralUrl } from "@/api/user";
import React, { useEffect, useState } from "react";
import "./index.scss";
const Download = () => {
  const [downloadUrl, setdownloadUrl] = useState('https://play.google.com/store/apps/details?id=site.mises.browser')
  useEffect(() => {
    const referrer = sessionStorage.getItem('referrer')
    if(referrer){
      const misesId = referrer.indexOf('did:mises:')>-1 ? referrer.split('did:mises:')[1] : referrer
      getReferralUrl({
        misesId,
        type:'url',
        medium:'lending'
      }).then(res=>{
        setdownloadUrl(res.medium_url)
      })
    }
  }, [])

  return (
    <>
      <div className="m-position-relative">
        <img src="/static/images/bg.png" alt="" width='100%'/>
        <div className="mises-bg">
          <div>
            <img src="/static/images/download-logo.png" alt="" className="download-logo"/>
            <p className="mises-txt">Mises</p>
          </div>
        </div>
      </div>
      <img src="/static/images/download.png" alt="" className="download-png"/>
      <div className="option">
        <p>· A decentralized social network</p>
        <p>· A browser to discover the brand new world of web3</p>
        <p>· A crypto wallet supports ethereum and other chains</p>
      </div>
      <a href={downloadUrl} target="_blank" className="download" rel="noreferrer">Download</a>
    </>
  );
};
export default Download;
