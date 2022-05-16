/*
 * @Author: lmk
 * @Date: 2021-08-07 22:30:53
 * @LastEditTime: 2022-05-12 14:05:59
 * @LastEditors: lmk
 * @Description:
 */
import React from "react";
import { NavBar } from "antd-mobile";
import backIcon from "@/images/back.png";
import './index.scss'
const Navbar = ({ title,rightChild,fixed=false }) => {
  const back = () => {
    if (window.history.length === 1) {
      window.location.replace("/home/discover");
    } else {
      window.history.back();
    }
  };
  return (
    <NavBar onBack={back}
      className={fixed ? "fixed-navbar" : ""}
      backArrow={<img src={backIcon} alt="" width={22} height={22} style={{display:'block'}}/>}
      right={rightChild}>
      <span style={{
        fontSize: '19px',
        fontWeight: 'bold',
        color:'#333'
      }}>{title}</span>
    </NavBar>
  );
};
export default Navbar;
