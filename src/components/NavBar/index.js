/*
 * @Author: lmk
 * @Date: 2021-08-07 22:30:53
 * @LastEditTime: 2022-06-11 00:32:16
 * @LastEditors: lmk
 * @Description:
 */
import React from "react";
import { NavBar } from "zarm";
import backIcon from "@/images/back.png";

const Navbar = ({ title,rightBtnClick,rightChild }) => {
  const back = () => {
    if (window.history.length === 1) {
      window.location.replace("/home/discover");
    } else {
      window.history.back();
    }
  };
  return (
    <NavBar
      left={
        <img
          src={backIcon}
          alt="back"
          onClick={back}
          style={{ width: "22px", height: "22px" }}
        />
      }
      title={title}
      right={rightChild}
    />
  );
};
export default Navbar;
