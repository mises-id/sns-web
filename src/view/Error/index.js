/*
 * @Author: lmk
 * @Date: 2021-07-15 23:43:29
 * @LastEditTime: 2022-03-24 18:49:07
 * @LastEditors: lmk
 * @Description: my post page
 */
import React from "react";
import "./index.scss";
import { UndoOutline} from "antd-mobile-icons";
const Error = () => {
  const refresh = ()=>{
    window.location.replace('/')
  }
  return (
    <div className="fullpage">
      <div>
        <p className="error-tips">There is a small problem. Please try refreshing</p>
        <div className="refresh-btn" onClick={refresh}>
          <UndoOutline />
          <span>Refresh</span>
        </div>
      </div>
    </div>
  );
};
export default Error;
