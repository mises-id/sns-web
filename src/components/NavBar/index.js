/*
 * @Author: lmk
 * @Date: 2021-08-07 22:30:53
 * @LastEditTime: 2022-08-22 17:26:46
 * @LastEditors: lmk
 * @Description:
 */
import React from "react";
import { NavBar } from "zarm";
import backIcon from "@/images/back.png";

const Navbar = ({ title,rightChild,customBack}) => {
  const back = () => {
    if(customBack){
      customBack()
      return
    }
    if (!window.history.state) {
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
