/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-03-31 11:07:48
 * @LastEditors: lmk
 * @Description: Airdrop page
 */
import React from "react";
import "./index.scss";
const Download = () => {
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
      <a href="https://play.google.com/store/apps/details?id=site.mises.browser" target="_blank" className="download" rel="noreferrer">Download</a>
    </>
  );
};
export default Download;
