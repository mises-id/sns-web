/*
 * @Author: lmk
 * @Date: 2021-08-07 22:30:53
 * @LastEditTime: 2022-05-25 15:00:23
 * @LastEditors: lmk
 * @Description:
 */
import React from "react";
import { NavBar } from "antd-mobile";
import backIcon from "@/images/back.png";
import './index.scss'
import { useHistory } from "react-router-dom";
const Navbar = ({ title,rightChild,fixed=false }) => {
  const history = useHistory()
  const back = () => {
    if (history.length === 1) {
      history.replace("/home/discover");
    } else {
      history.go(-1);
    }
  };
  return (
    <NavBar onBack={back}
      className={fixed ? "fixed-navbar" : ""}
      backArrow={<img src={backIcon} alt="" width={22} height={22} style={{display:'block'}}/>}
      right={rightChild&&<div className="m-flex m-row-end">{rightChild}</div>}>
      <span style={{
        fontSize: '19px',
        fontWeight: 'bold',
        color:'#333'
      }}>{title}</span>
    </NavBar>
  );
};
export default Navbar;
