/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-10-27 13:59:25
 * @LastEditors: lmk
 * @Description: Airdrop page
 */
import { getReferralUrl } from "@/api/user";
import { isIosPlatform } from "@/utils";
import React, { useEffect, useState } from "react";
import "./index.scss";
const Download = () => {
  const defaultUrl = isIosPlatform() ? "https://testflight.apple.com/join/dFykgML6" : "https://play.google.com/store/apps/details?id=site.mises.browser";
  const [downloadUrl, setdownloadUrl] = useState(defaultUrl)
  useEffect(() => {
    const referrer = sessionStorage.getItem('referrer')
    if(referrer){
      const misesId = referrer.indexOf('did:mises:')>-1 ? referrer.split('did:mises:')[1] : referrer
      getDownloadUrl('landing', misesId)
    } else {
      const search = new URLSearchParams(window.location.search);
      const misesId = search.get('misesid');
      getDownloadUrl('invite', misesId)
    }
  }, [])

  const getDownloadUrl = (medium, misesId)=>{
    if(misesId){
      getReferralUrl({
        misesId,
        type:'url',
        medium
      }).then(res=>{
        const url = isIosPlatform() ? res.ios_medium_link : res.medium_url
        setdownloadUrl(url)
      })
    }
  }
  return (
    <>
      <div>
        <div className="mises-bg" style={{backgroundImage:"url('/static/images/bg.png')"}}>
          <div className="mises-logo-wrap">
            <img src="/static/images/download-logo.png" alt="" className="download-logo"/>
            <img src="/static/images/MisesBrowser.png" alt=""  className="download-name"/>
            <p>The world's first extension-supported </p>
            <p>mobile Web3 browser</p>
          </div>
        </div>
      </div>
      <img src="/static/images/download.png" alt="" className="download-png"/>
      <a href={downloadUrl} target="_blank" className="download" rel="noreferrer">Download</a>
    </>
  );
};
export default Download;
